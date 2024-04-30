import {
  Button,
  Checkbox,
  Flex,
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
  type UserCreate,
  type UserPublic,
  type UserUpdate,
  UsersService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { emailPattern } from "../../utils";

interface UserFormProps {
  user?: UserPublic; // Only needed for edit mode
  mode: "add" | "edit";
  isOpen: boolean;
  onClose: () => void;
}

interface UserFormFields extends UserCreate {
  confirm_password: string;
}

const UserForm = ({ user, mode, isOpen, onClose }: UserFormProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserFormFields>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: isEdit
      ? { ...user, confirm_password: "" }
      : {
          email: "",
          full_name: "",
          password: "",
          confirm_password: "",
          is_superuser: false,
          is_active: false,
        },
  });  

  const mutation = useMutation({
    mutationFn: (data: UserFormFields) => {
      const { confirm_password, ...formData } = data;
      return isEdit
        ? UsersService.updateUser({
            userId: user!.id,
            requestBody: formData as UserUpdate,
          })
        : UsersService.createUser({ requestBody: formData as UserCreate });
    },
    onSuccess: () => {
      showToast(
        "Success!",
        `User ${isEdit ? "updated" : "created"} successfully.`,
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onSubmit: SubmitHandler<UserFormFields> = (data) => {
    if (isEdit && !data.password) {
      data.password;
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
          <ModalHeader>{isEdit ? "Edit User" : "Add User"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: emailPattern,
                })}
                placeholder="Email"
                type="email"
              />
              {errors.email && (
                <FormErrorMessage>{errors.email.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.full_name}>
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <Input
                id="name"
                {...register("full_name")}
                placeholder="Full Name"
                type="text"
              />
              {errors.full_name && (
                <FormErrorMessage>{errors.full_name.message}</FormErrorMessage>
              )}
            </FormControl>
            {isEdit ? null : (
              <>
                <FormControl
                  mt={4}
                  isRequired={!isEdit}
                  isInvalid={!!errors.password}
                >
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    {...register("password", {
                      required: isEdit || "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    placeholder="Password"
                    type="password"
                  />
                  {errors.password && (
                    <FormErrorMessage>
                      {errors.password.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  mt={4}
                  isRequired={!isEdit}
                  isInvalid={!!errors.confirm_password}
                >
                  <FormLabel htmlFor="confirm_password">
                    Confirm Password
                  </FormLabel>
                  <Input
                    id="confirm_password"
                    {...register("confirm_password", {
                      required: isEdit || "Confirm password is required",
                      validate: (value) =>
                        value === getValues().password ||
                        "Passwords do not match",
                    })}
                    placeholder="Confirm Password"
                    type="password"
                  />
                  {errors.confirm_password && (
                    <FormErrorMessage>
                      {errors.confirm_password.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </>
            )}
            <Flex mt={4}>
              <Checkbox mr={4} {...register("is_superuser")} colorScheme="teal">
                Is superuser?
              </Checkbox>
              <Checkbox {...register("is_active")} colorScheme="teal">
                Is active?
              </Checkbox>
            </Flex>
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

export default UserForm;
