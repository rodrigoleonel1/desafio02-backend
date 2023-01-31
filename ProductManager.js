const fs = require('fs')

let products = []

class ProductManager {
    constructor(path) {
        this.path = path
    }

    idGenerator = () =>{
        const count = products.length
        if (count === 0){
            return 1
        } else {
            return (products[count-1].id) + 1     
        }
    }

    getProducts = () =>{
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
        let allProducts = fs.readFileSync(this.path, 'utf-8')
        console.log(JSON.parse(allProducts)) 
    }

    getProductById = ( id ) =>{
        const productById = products.find(e => e.id === id)
        if (productById === undefined){
            return console.error ("Not found.")
        } 
        return console.log(productById)
    }

    addProduct = ( title, description, price, thumbnail, code, stock ) => {
        const id = this.idGenerator()

        if( !title || !description || !price || !thumbnail || !code || !stock ){
            console.error('No se pudo agregar el producto porque no se completaron todos los datos necesarios.')
            return
        }

        if (products.find(e => e.code === code)){
            console.error(`El producto "${title}" no puede ser agregado porque ya existe un producto con el mismo código.`)
            return
        }

        products.push({         
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        })
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
    }

    updateProduct = ( id, title, description, price, thumbnail, code, stock ) =>{
        const product = products.find(e => e.id === id)
        if (product === undefined){
            console.error ("No existe un producto con ese id, no se pudo actualizar.")
            return
        } 

        if( !title || !description || !price || !thumbnail || !code || !stock ){
            console.error('No se pudo actualizar el producto porque no se completaron todos los datos necesarios.')
            return
        }
        
        product.id = id
        product.title = title
        product.description = description
        product.price = price
        product.thumbnail = thumbnail
        product.code = code
        product.stock = stock
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
        console.log('El producto fue actualizado con éxito.')
    }

    deleteProduct = ( id ) =>{
        const product = products.find(e => e.id === id)
        if (product === undefined){
            return console.error ("No existe un producto con ese id, no se pudo eliminar.")
        } else {
            const productIndex = products.indexOf(product)
            products.splice(productIndex, 1)
            if(products.length === 0){
                fs.unlinkSync(this.path, 'utf-8')
            } else{
                fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
            }
            return console.log(`El producto "${product.title}" fue eliminado.`)
        }
    }
}

const productManager = new ProductManager('products.json')
productManager.getProducts()
productManager.addProduct('Producto prueba', 'Esto es un producto prueba', 200, 'Sin imagen', 'abc123', 25)
productManager.getProducts()
productManager.getProductById(1)
productManager.getProductById(99)
productManager.updateProduct( 1, 'Producto actualizado', 'Descripcion actualizada', 333, 'Sin imagen', 'codigoActualizado', 55)
productManager.deleteProduct(1)