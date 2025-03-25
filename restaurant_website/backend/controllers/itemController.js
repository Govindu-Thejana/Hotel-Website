import Item from "../models/item.js";

export function getAllItems(req, res) {


    Item.find().then(
        (items) => {
            res.json(items);
        }
    ).catch(
        () => {
            res.status(500).json({
                message: "Error"
            });
        }
    )
}

export function saveItem(req, res) {

    console.log(req.user);
    if (req.user.role !== "admin") {
        res.status(403).json({
            message: "You cannot save items"
        });
        return;
    }

    const newItem = new Item(req.body);
    newItem.save().then(
        () => {
            res.json({
                message: "Item saved"
            });
        }
    ).catch(
        () => {
            res.status(500).json({
                message: "Error"
            });
        }
    )
}

export function getGoodItems(req, res) {
    res.json({
        message: "Good items"
    }); 
}
export function searchItems(req, res) {
    const name= req.params.name;
    Item.find(
        {
            name: name
        }
    ).then(
        (items) => {
            res.json(items);
        }
    ).catch(
        () => {
            res.json({
                message: "Error"
            }); 
        }
    )       
}