// WISH-LIST

two seperate api - add-product first time when user is not signedIn - add-to-wishlist when user is signed in

//add-product/ --->api (when token not present)
on UI user CLICK on add-to-wish list
-if token not present in local-session
-request to sign in the user
-if user not found
-make user to sign up to add to wishlist and return the user
-else user found
-send the user token
-and all the wishlist item user already has + the new item that is added
-if the added item is already in used presius added list return the list as it is

// add-to-wish list (when token is present)
On UI user CLICK again to add someOther item to wishlist
-if token present int he local-session
-pass the token and the product id to backend
-decode the token
-take the username and email from the token - get the wishlist document of that user from DB - check the product id if present in the wishlist
-if already present delete it  
 -else add the new wishlist item

// CART ITEM

//add-product/ (same as wish list common api) (when token not present)
On UI click of add to cart item
-if token is not present on UI local session
-store the product of cart in redux store
-use backend at time of payment

    -if user signin/signup while having product in cart (initially not signed in)
        - take the products from redux store

            - sign in case
            - verify if user is registered user
                -if yes user is registed
                    -take the cart product already stored by user in table + add the new product in db and return all the products

                -sign up case
                -else if user not already registerd
                    (ON UI MAKE THE FALSE APPEAREANCE THAT CART is update and make asyc backed call aswell)
                    - add user to database in registered user table
                    - add cart product in cart table and return the information

// add to cart
add-cart --> api (token is present) (means user is registered)
On UI +/- on cart item - token is present - send token to backend with productID {token , productID , add/sub } - if user not presnet in userCartItem table
-means user has registed but has no item in cart annd not entered in table - make new entry of user and add the product in cart {productId , quantity}

        if user already present in the userCartTable
            - get List of the user cart prodcut stored
            - check if the product is already present in the list
                - if yes
                    -add : increse the quantiy as per user sent value + already what was there
                    -sub : original - derease the quantiy as per value sent >= 0
                else NO (item not presnt and user select new one)
                    -add the new item to cart and return all the update cart(new + old items from db)

                    Apply Dbouncing on UI to make less api call on product increse and decrease api
                    MAKE FALSE APPASE ON API TO TELL USER AT TIME BEING AND update AFTER SOME TIME IN BACKEND

// SEND FESTIVE PRODUCT

     body - { tag: "diwali"}
        send all produt of diwali tag
        response: {
            top_items:[{}],
            all_tems:[{}]
        }

// SEND ON CATEGORY
body - {category :"CAKEs"}

    send all the prodcut of cakes
        respone:{
            all_items:[{}]
        }

// PAYMENT METHOD

//ADD PRODUCT WITH IMAGE

******\*\******* BASIC CRUD API ******\*\*\*\*******
// UPDATE PRODUCT

// DELETE PRODUCT

// ADD ITEM IN BULK

when user is signed in and UI Recives the token
-make normal wish list add {prodcutID , token}

if not signed in
-click on add to cart
{
handle on UI for CART part in redux
}

if signed in (UI is sending token)
-click on add to cart
req{
email,
productId:
token:
wihslistOrCart: indicator value "W" or "C"
}

    On UI make the false appease added to cart
        - on backend make the db call to check if the user is present or not in the add to cart table
        - if not make the document of the user same as wish list part
        - if the indicator is C
            - {
                incement : 1
                decremnt :1
                product id
            }

Sign up - check if the email is already present in data base - if present send
"USER ALREADY REGISTERED" - if not
make the document for the user - if at that time user has some item in the cart or the wishlist also store them in the database

                if user is not present
                requestBody,
                {
                    username
                    email
                    password
                    phone number
                    cartItems[],
                    wishlistItems[]
                }

                responseBody:{
                    refId:,
                    message:[],
                    responeBody:{
                        token:,
                        email,
                        userId,
                        cartItems[],
                        wishlistItems[]
                    }
                }

Sign in

    - can Sign in normally by clicking the sigin button on UI

        - reqBody :{
            email,
            password,
        }


        response: {

            refId:,
            message:[],
            responseData:{
                token:,
                cartDetails:[],
                wishlistDetails:[]
            }
        }
