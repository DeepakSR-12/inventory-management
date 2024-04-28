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
  type WarehousePublic,
  type WarehouseUpdate,
  WarehousesService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface EditWarehouseProps {
  warehouse: WarehousePublic;
  isOpen: boolean;
  onClose: () => void;
}

const EditWarehouse = ({ warehouse, isOpen, onClose }: EditWarehouseProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<WarehouseUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: warehouse,
  });

  console.log({ warehouse });

  const mutation = useMutation({
    mutationFn: (data: WarehouseUpdate) =>
      WarehousesService.updateWarehouse({
        id: warehouse.id,
        requestBody: data,
      }),
    onSuccess: () => {
      showToast("Success!", "Warehouse updated successfully.", "success");
      onClose();
    },
    onError: (err: ApiError) => {
      const errDetail = (err.body as any)?.detail;
      showToast("Something went wrong.", `${errDetail}`, "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });

  const onSubmit: SubmitHandler<WarehouseUpdate> = async (data) => {
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
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Edit Warehouse</ModalHeader>
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

            <FormControl mt={4} isRequired isInvalid={!!errors.location}>
              <FormLabel htmlFor="location">Location</FormLabel>
              <Input
                id="Warehouse_price"
                {...register("location")}
                placeholder="Location"
                type="text"
              />
              {errors.location && (
                <FormErrorMessage>{errors.location.message}</FormErrorMessage>
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
              Save
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditWarehouse;
