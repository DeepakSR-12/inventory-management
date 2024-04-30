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

import {
  type ApiError,
  type ItemCreate,
  type ItemPublic,
  type ItemUpdate,
  ItemsService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface ItemFormProps {
  item?: ItemPublic; // Only needed for edit mode
  mode: "add" | "edit";
  isOpen: boolean;
  onClose: () => void;
}

const ItemForm = ({ item, mode, isOpen, onClose }: ItemFormProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const isEdit = mode === "edit";

  const {
    register,    
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ItemCreate | ItemUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: isEdit
      ? item
      : {
          name: "",
          warehouse_price: null,
          retail_price: null,
        },
  });

  const mutation = useMutation({
    mutationFn: (data: ItemCreate | ItemUpdate) =>
      isEdit
        ? ItemsService.updateItem({ id: item!.id, requestBody: data })
        : ItemsService.createItem({ requestBody: data }),
    onSuccess: () => {
      showToast(
        "Success!",
        `Item ${isEdit ? "updated" : "created"} successfully.`,
        "success"
      );
      reset();
      onClose();
    },
    onError: (err: ApiError) => {
      const errDetail = (err.body as any)?.detail;
      showToast("Something went wrong.", `${errDetail}`, "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const onSubmit: SubmitHandler<ItemCreate | ItemUpdate> = (data) => {
    if (data?.warehouse_price! > data?.retail_price!) {
      showToast("Value Error", "Warehouse Price cannot be greater than Retail Price.", "error");
      return;
    }
    mutation.mutate(data);
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
          <ModalHeader>{isEdit ? "Edit Item" : "Add Item"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                {...register("name", {
                  required: "Name is required.",
                })}
                placeholder="Name"
                type="text"
              />
              {errors.name && (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={!!errors.warehouse_price}>
              <FormLabel htmlFor="warehouse_price">Warehouse Price</FormLabel>
              <Input
                id="warehouse_price"
                {...register("warehouse_price", {
                  valueAsNumber: true,
                })}
                placeholder="Warehouse Price"
                type="number"
                min={0}
              />
              {errors.warehouse_price && (
                <FormErrorMessage>
                  {errors.warehouse_price.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={!!errors.retail_price}>
              <FormLabel htmlFor="retail_price">Retail Price</FormLabel>
              <Input
                id="retail_price"
                {...register("retail_price", {
                  valueAsNumber: true,
                })}
                placeholder="Retail Price"
                type="number"
                min={0}
              />
              {errors.retail_price && (
                <FormErrorMessage>
                  {errors.retail_price.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              isDisabled={isEdit && !isDirty}
            >
              {isEdit ? "Update" : "Add"}
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemForm;
