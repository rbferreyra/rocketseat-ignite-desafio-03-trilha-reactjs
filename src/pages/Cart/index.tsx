import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
  MdRemoveShoppingCart,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map(product => ({
    ...product,
    priceFormatted: formatPrice(product.price * product.amount)
  }))
  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        sumTotal += (product.price * product.amount);

        return sumTotal;
      }, 0)
    )

  function handleProductIncrement(product: Product) {
    const newProduct = {
      productId: product.id,
      amount: product.amount + 1
    }

    updateProductAmount(newProduct);
  }

  function handleProductDecrement(product: Product) {
    const newProduct = {
      productId: product.id,
      amount: product.amount - 1
    }

    updateProductAmount(newProduct);
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatted.length > 0
            ? (
              <>
                {cartFormatted.map(product => {
                  return <tr data-testid="product" key={product.id}>
                    <td>
                      <img src={product.image} alt={product.title} />
                    </td>
                    <td>
                      <strong>{product.id} - {product.title}</strong>
                      <span>{formatPrice(product.price)}</span>
                    </td>
                    <td>
                      <div>
                        <button
                          type="button"
                          data-testid="decrement-product"
                          disabled={product.amount <= 1}
                          onClick={() => handleProductDecrement(product)}
                        >
                          <MdRemoveCircleOutline size={20} />
                        </button>
                        <input
                          type="text"
                          data-testid="product-amount"
                          readOnly
                          value={product.amount}
                        />
                        <button
                          type="button"
                          data-testid="increment-product"
                          onClick={() => handleProductIncrement(product)}
                        >
                          <MdAddCircleOutline size={20} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <strong>{product.priceFormatted}</strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        data-testid="remove-product"
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                })}
              </>
            )
            : (
              <tr data-testid="product" key="1">
                <td colSpan={5} className="empty">
                  <MdRemoveShoppingCart size={180} color="#909090" />
                  <p>
                    Seu carrinho está vazio!
                  </p>
                  <a href="/">Continuar comprando</a>
                </td>
              </tr>
            )}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
