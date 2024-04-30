import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type ApiError, PurchasesService, PurchaseCreate } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  id: number;
  store: number;
  item: number;
  itemName: string;
  itemQuantity: number;
  warehouse_price: number;
  retail_price: number;
}

interface RecordPurchaseForm {
  item: string;
  quantity: number | null;
}

const PurchaseForm = ({
  isOpen,
  onClose,
  id,
  store,
  item,
  itemName,
  itemQuantity,
  warehouse_price,
  retail_price,
}: PurchaseFormProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      item: itemName,
      quantity: null,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PurchaseCreate) =>
      PurchasesService.createPurchase({
        requestBody: data,
        previousQuantity: itemQuantity,
        id,
      }),
    onSuccess: () => {
      showToast("Success!", `Purchase recorded successfully.`, "success");
      reset();
      onClose();
    },
    onError: (err: ApiError) => {
      const errDetail = (err.body as any)?.detail;
      showToast("Something went wrong.", `${errDetail}`, "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["storeItemsById"] });
    },
  });

  const onSubmit: SubmitHandler<RecordPurchaseForm> = (data) => {
    // Current Date
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const requestBody: PurchaseCreate = {
      item_id: item,
      item_name: itemName,
      quantity: Number(data?.quantity!),
      warehouse_price,
      retail_price,
      date: formattedDate,
      store_id: store,
    };
    mutation.mutate(requestBody);
  };

  const onCancel = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onCancel}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Record a Purchase</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4} isDisabled isInvalid={!!errors.item}>
              <FormLabel htmlFor="item">Item</FormLabel>
              <Input
                id="item"
                {...register("item", {
                  required: "Name is required.",
                })}
                placeholder="Name"
                type="text"
              />
              {errors.item && (
                <FormErrorMessage>{errors.item.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl mt={4} isRequired isInvalid={!!errors.quantity}>
              <FormLabel htmlFor="quantity">
                {`Quantity (Available Quantity: ${itemQuantity})`}
              </FormLabel>
              <Input
                id="quantity"
                {...register("quantity", {
                  required: "Quantity is required.",
                  validate: () =>
                    Number(watch("quantity")) <= itemQuantity! ||
                    "Quantity to purchase cannot be greater than available quantity",
                })}
                placeholder="Enter Quantity"
                type="number"
                min={0}
              />
              {errors.quantity && (
                <FormErrorMessage>{errors.quantity.message}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!isDirty}
            >
              Record
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PurchaseForm;
