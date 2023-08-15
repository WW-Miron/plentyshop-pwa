import type { ShippingProvider } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { toRefs } from '@vueuse/shared';
import type {
  UseCartShippingMethodsState,
  UseCartShippingMethodsReturn,
  GetShippingMethods,
  SaveShippingMethod,
} from '~/composables/useCartShippingMethods/types';
import { useSdk } from '~/sdk';

/**
 * @description Composable for getting shipping methods.
 * @example
 * const { data, loading, getShippingMethods } = useCartShippingMethods();
 */

export const useCartShippingMethods: UseCartShippingMethodsReturn = () => {
  const state = useState<UseCartShippingMethodsState>('useCartSippingMethods', () => ({
    data: {} as ShippingProvider,
    loading: false,
  }));

  /**
   * @description Function for fetching shipping methods.
   * @example
   * getShippingMethods();
   */

  const getShippingMethods: GetShippingMethods = async () => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getShippingProvider());
    useHandleError(error.value);
    state.value.data = data.value?.data ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  const saveShippingMethod: SaveShippingMethod = async (shippingMethodId: number) => {
    state.value.loading = true;
    const { error } = await useAsyncData(() => useSdk().plentysystems.setShippingProvider({
      shippingId: shippingMethodId
    }));
    useHandleError(error.value);
    state.value.loading = false;
  }

  return {
    saveShippingMethod,
    getShippingMethods,
    ...toRefs(state.value),
  };
};
