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
  Select,
} from "@chakra-ui/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import {
  type ApiError,
  ItemsService,
  WarehouseItemsByIdCreate,
  WarehouseItemsByIdService,
  WarehouseItemsByIdPublic,
  WarehouseItemsByIdUpdate,
  StoresService,
  StoreItemsByIdCreate,
  StoreItemsByIdService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { useEffect } from "react";

interface WarehouseItemsFormProps {
  mode: "add" | "edit" | "ship";
  warehouseItem?: WarehouseItemsByIdPublic;
  isOpen: boolean;
  onClose: () => void;
  warehouseId?: number;
}

interface ReceiveWarehouseItemsForm {
  selectedStore?: string;
  selectedItem?: string;
  quantity?: string;
}

const WarehouseItemsForm = ({
  mode,
  isOpen,
  onClose,
  warehouseId,
  warehouseItem,
}: WarehouseItemsFormProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const isEdit = mode === "edit";
  const isShip = mode === "ship";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: isEdit
      ? {
          selectedItem: String(warehouseItem?.item_id),
          quantity: String(warehouseItem?.quantity),
        }
      : isShip
        ? {
            selectedItem: String(warehouseItem?.item_id),
            quantity: "",
            selectedStore: "",
          }
        : { selectedItem: "", quantity: "" },
  });

  const {
    data: items,
    refetch: refetchItems,
    isFetching: isFetchingItems,
  } = useQuery({
    enabled: false,
    queryKey: ["items"],
    queryFn: () => ItemsService.readItems({}),
  });

  const {
    data: stores,
    refetch: refetchStores,
    isFetching: isFetchingStores,
  } = useQuery({
    enabled: false,
    queryKey: ["stores"],
    queryFn: () => StoresService.readStores({}),
  });

  useEffect(() => {
    if (isOpen) {
      if (isShip) {
        refetchStores();
      }
      refetchItems();
    }
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: (
      data:
        | StoreItemsByIdCreate
        | WarehouseItemsByIdCreate
        | WarehouseItemsByIdUpdate
    ) =>
      isEdit
        ? WarehouseItemsByIdService.updateWarehouseItemsById({
            id: warehouseItem!.id,
            requestBody: data,
          })
        : isShip
          ? StoreItemsByIdService.shipItemsById({              
              requestBody: data,
              id: warehouseItem!.id,
              previousQuantity: warehouseItem?.quantity!,
            })
          : WarehouseItemsByIdService.receiveWarehouseItemsById({
              requestBody: data,
            }),
    onSuccess: () => {
      showToast(
        "Success!",
        `Warehouse items ${isEdit ? "updated" : isShip ? "shipped" : "received"} successfully.`,
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
      queryClient.invalidateQueries({ queryKey: ["warehouseItemsById"] });
    },
  });

  const onSubmit: SubmitHandler<ReceiveWarehouseItemsForm> = (data) => {
    const selectedItemId = data?.selectedItem!;
    const item = items?.data.find((item) => item?.id == Number(selectedItemId));

    const requestBody:
      | WarehouseItemsByIdCreate
      | WarehouseItemsByIdUpdate
      | StoreItemsByIdCreate = {
      ...(isShip ? { store_id: Number(data?.selectedStore)! } : null),
      warehouse_id:
        isEdit || isShip ? warehouseItem?.warehouse_id! : warehouseId!,
      quantity: Number(data?.quantity),
      warehouse_price: item?.warehouse_price!,
      retail_price: item?.retail_price!,
      item_id: Number(selectedItemId),
      item_name: item?.name!,
    };    

    mutation.mutate(requestBody);
  };

  const onCancel = () => {
    reset();
    onClose();
  };

  return (
    <>
      {isOpen ? (
        <Modal
          isOpen={isOpen}
          onClose={onCancel}
          size={{ base: "sm", md: "md" }}
          isCentered
        >
          <ModalOverlay />
          <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              {isEdit
                ? "Edit an Item"
                : isShip
                  ? "Ship an Item"
                  : "Receive an Item "}
            </ModalHeader>

            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired isInvalid={!!errors.selectedItem}>
                <FormLabel htmlFor="selectedItem">Item</FormLabel>
                <Select
                  disabled={isEdit || isShip}
                  id="selectedItem"
                  value={watch()?.selectedItem}
                  {...register("selectedItem", {
                    required: "Item selection is required.",
                  })}
                  placeholder="Select an Item"
                >
                  {!isFetchingItems &&
                    !!items?.data?.length &&
                    items?.data.map((item) => (
                      <option key={item?.id} value={item?.id}>
                        {item?.name}
                      </option>
                    ))}
                </Select>
                {errors.selectedItem && (
                  <FormErrorMessage>
                    {errors.selectedItem.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl mt={4} isRequired isInvalid={!!errors.quantity}>
                <FormLabel htmlFor="quantity">
                  Quantity{" "}
                  {isShip
                    ? `(Available Quantity: ${warehouseItem?.quantity})`
                    : null}
                </FormLabel>
                <Input
                  id="quantity"
                  {...register("quantity", {
                    required: "Quantity is required.",
                    validate: () =>
                      !isShip ||
                      Number(watch("quantity")) <= warehouseItem?.quantity! ||
                      "Quantity to ship cannot be greater than available quantity",
                  })}
                  placeholder="Enter Quantity"
                  type="number"
                  min={0}
                />
                {errors.quantity && (
                  <FormErrorMessage>{errors.quantity.message}</FormErrorMessage>
                )}
              </FormControl>
              {isShip ? (
                <FormControl
                  mt={4}
                  isRequired
                  isInvalid={!!errors.selectedStore}
                >
                  <FormLabel htmlFor="selectedStore">Store</FormLabel>
                  <Select
                    id="selectedStore"
                    value={watch()?.selectedStore}
                    {...register("selectedStore", {
                      required: "Store selection is required.",
                    })}
                    placeholder="Select a Store"
                  >
                    {!isFetchingStores &&
                      !!stores?.data?.length &&
                      stores?.data.map((store) => (
                        <option key={store?.id} value={store?.id}>
                          {store?.name}
                        </option>
                      ))}
                  </Select>
                  {errors.selectedStore && (
                    <FormErrorMessage>
                      {errors.selectedStore.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              ) : null}
            </ModalBody>
            <ModalFooter gap={3}>
              <Button
                variant="primary"
                type="submit"
                isLoading={isSubmitting}
                isDisabled={(isEdit || isShip) && !isDirty}
              >
                {isShip ? "Ship" : isEdit ? "Update" : "Receive"}
              </Button>
              <Button onClick={onCancel}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : null}
    </>
  );
};

export default WarehouseItemsForm;
