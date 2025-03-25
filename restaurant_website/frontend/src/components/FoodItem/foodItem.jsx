import {useContext} from 'react';
import './foodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';

const FoodItem = ({ id, name, description, price, image }) => {
  // const [itemCount, setItemCount] = useState(0);

  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);


  return (
    <div className='food-item'>
      <div className="food-item-image-container">
        <img className='food-item-image' src={image} alt="" />
        {!cartItems[id]
          ?
          <img
            className='add'
            onClick={async () => {
              try {
                await addToCart(id);
                toast.success('Item added to cart!',id);
              } catch (error) {
                console.error('Error adding item to cart:', error);
                toast.error('Failed to add item to cart. Please try again.');
              }
            }}
            src={assets.add_icon_white}
            alt=""
          />
          : <div className='food-item-counter'>
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />

            <p>{cartItems[id]}</p>
            <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" /> 
          </div>
        }

        

       
        {/* // ?<img className='add' onClick={()=>setItemCount(prev=>prev+1)} src={assets.add_icon_white} alt="" />
          //!cartItems[id]
         // ?<img className='add' src={assets.add_icon_white} alt="" onClick={()=>addToCart(id)} />
          :<div className='food-item-counter'>
            <img onClick={()=>setItemCount(prev=>prev-1)} src={assets.remove_icon_red} alt="" />
            <p>{itemCount}</p>
            <img onClick={()=>setItemCount(prev=>prev+1)} src={assets.add_icon_green} alt="" />
            {/* 
        } */}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-description">{description}</p>
        <p className="food-item-price">Rs:{price}</p>
      </div>
    </div>
  );
}

export default FoodItem;