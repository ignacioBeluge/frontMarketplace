import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import CartList from "./CartList";


const CartPadre = ({token}) => {
    const[cart, setCart] = useState({items:[], totalPrice: 0});
    const navigate = useNavigate();
    const URL = 'http://localhost:8080/cart'

    useEffect(() => {
        if(!token) {
            navigate('/login');
            return
        }

        fetch (URL, {
            headers:{
                "Authorization" : `Bearer ${token}`
            }
        })
        .then((response) => response.json())
        .then((data) => setCart(data))
        .catch((err) => console.error("Error", err))
    },[token])

    const updateCantidad = (productId, cantidad) => {
        console.log("Enviando:", { productId, quantity: cantidad });
        fetch("http://localhost:8080/cart/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        body: JSON.stringify({productId, quantity: cantidad})
    })
    .then(() => {
        fetch(URL, {
            headers:{
                "Authorization" : `Bearer ${token}`
            }
        })
    .then(async (response) => {
        if (!response.ok) {
            throw new Error("Error act");
        }
        return response.json()
    })
    .then((data) => setCart(data))
    })
    .catch((err) => console.error("Error al actualizar", err))
}

    const removeItem = (productId) => {
        fetch(`http://localhost:8080/cart/remove/${productId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(()=> {
            fetch(URL, {
                headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then((response) => response.json())
        .then((data) => setCart(data))
    })
    .catch((err) => console.error("Error al eliminar", err))
    }

    return (
        <div>
        <CartList 
        items = {cart.items}
        total = {cart.totalPrice}
        onUpdateCantidad = {updateCantidad}
        onDeleteItem = {removeItem}
        />
        
        {cart.items.length > 0 &&
        <button onClick={() => navigate("/checkout")}>
            Seleccionar medio de pago
        </button>
        }

        </div>
    )

}

export default CartPadre;