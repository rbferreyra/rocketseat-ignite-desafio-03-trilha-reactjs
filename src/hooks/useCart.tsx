import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      //buscar o estoque do produto
      const responseStock = await api.get<Stock>(`stock/${productId}`);
      const stock = responseStock.data;

      //buscar o produto no carrinho
      const productCart = cart.find(cart => cart.id === productId);

      //caso não exista o produto, vamos incluir produto no carrinho
      if (!productCart) {
        //busca o produto
        const responseProduct = await api.get<Product>(`products/${productId}`);
        const product = responseProduct.data;

        //inclui a propriedade amount
        const newProduct = {
          ...product,
          amount: 1
        }

        //incluir o produto no carrinho
        const newCart = [
          ...cart,
          newProduct
        ];

        //salva no localstorage
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));

        //salva o estado do carrinho
        setCart(newCart);

        toast.success('Produto adicionado ao carrinho!');
      } else {
        //caso exista o produto, vamos incrementar a quantidade de 
        //itens do produto no carrinho

        //verifica c tem estoque do produto
        if (stock.amount < productCart.amount + 1) {
          toast.error('Quantidade solicitada fora de estoque');
          return;
        }

        //realiza o increment da quantidade de itens do produto
        const newCart = cart.map(cart => cart.id === productId
          ? {
            ...cart,
            amount: cart.amount + 1
          }
          : cart);

        //salva no localstorage
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));

        //salva o estado do carrinho
        setCart(newCart);

        toast.success('Produto adicionado ao carrinho!');
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      //remover o produto do carrinho
      const newCart = cart.filter(cart => cart.id !== productId);

      //salva a lista de produtos
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));

      //salva o estado do carrinho
      setCart(newCart);

      toast.success('Produto removido do carrinho!');
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
