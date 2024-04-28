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
    type StoreCreate,
    type StorePublic,
    type StoreUpdate,
    StoresService,
  } from "../../client";
  import useCustomToast from "../../hooks/useCustomToast";
  
  interface StoreFormProps {
    mode: "add" | "edit";
    store?: StorePublic; // Only needed for edit mode
    isOpen: boolean;
    onClose: () => void;
  }
  
  const StoreForm = ({
    mode,
    store,
    isOpen,
    onClose,
  }: StoreFormProps) => {
    const queryClient = useQueryClient();
    const showToast = useCustomToast();
    const isEdit = mode === "edit";
  
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting, isDirty },
    } = useForm({
      mode: "onBlur",
      criteriaMode: "all",
      defaultValues: isEdit ? store : { name: "", location: "" },
    });
  
    const mutation = useMutation({
      mutationFn: (data: StoreCreate | StoreUpdate) =>
        isEdit
          ? StoresService.updateStore({
              id: store!.id,
              requestBody: data,
            })
          : StoresService.createStore({ requestBody: data }),
      onSuccess: () => {
        showToast(
          "Success!",
          `Store ${isEdit ? "updated" : "created"} successfully.`,
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
        queryClient.invalidateQueries({ queryKey: ["stores"] });
      },
    });
  
    const onSubmit: SubmitHandler<StoreCreate | StoreUpdate> = (data) => {
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
            <ModalHeader>
              {isEdit ? "Edit Store" : "Add Store"}
            </ModalHeader>
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
              <Button
                variant="primary"
                type="submit"
                isLoading={isSubmitting}
                isDisabled={isEdit && !isDirty}
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
  
  export default StoreForm;
  