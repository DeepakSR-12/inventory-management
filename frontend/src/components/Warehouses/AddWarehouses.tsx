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
  type WarehouseCreate,
  WarehousesService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface AddWarehouseProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddWarehouse = ({ isOpen, onClose }: AddWarehouseProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WarehouseCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      location: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: WarehouseCreate) =>
      WarehousesService.createWarehouse({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Warehouse created successfully.", "success");
      reset();
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

  const onSubmit: SubmitHandler<WarehouseCreate> = (data) => {
    mutation.mutate(data);
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
          <ModalHeader>Add Warehouse</ModalHeader>
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
                id="location"
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
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddWarehouse;
