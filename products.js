// 建立 Vue 實體 v
// 串接 products api v
// - checkLogin v
// 建立 bs Modal
// - 新增
// - 修改
// - 刪除

// 建立元件：引入 Vue 函式庫
import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js" // 此為 vue esm 函式庫 

const apiUrl = 'https://vue3-course-api.hexschool.io/';// 設定站點變數
const apiPath = 'kris-api'; // 設定路徑變數


// bs Modal
// const myModalAlternative = new bootstrap.Modal('#myModal', options)
let productModal = {};
let delProductModal = {};


const app = {
    data() {
        return {
            products: [],
            tempProduct: { // 新增產品，因產品有多個屬性，以物件方式包覆
                imageUrl: [],
            },
            isNew: false, // 確認是「編輯」或「新增」所使用的

        }
    },
    methods: {
        checkLogin() {
            // 網址列也可以寫成 const url=`${apiUrl}v2/api/user/check` 再帶入 axios 中
            // 驗證是否為管理員登入
            axios.post(`${apiUrl}v2/api/user/check`)
                .then(res => {
                    // console.log('驗證登入',res)
                    this.getProducts();
                })
                .catch(err => {
                    window.location = './login.html'
                })

        },
        getProducts() {
            axios.get(`${apiUrl}v2/api/${apiPath}/admin/products/all`)
                .then((res) => {
                    // console.log('產品列表',res);
                    this.products = res.data.products;
                    console.log('this.products', this.products)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 「建立新產品」按鈕與彈出視窗綁定
        // status 目的在於判斷是「編輯」、「新增」或其它功能打開彈出視窗
        openModal(status, product) {

            //console.log(status)
            if (status === 'create') {
                productModal.show();
                this.isNew = true;
                // 帶入初始化資料
                this.tempProduct = {
                    imageUrl: [],
                };
            } else if (status === 'edit') {
                productModal.show();
                this.isNew = false;
                // 帶入當前要編輯的資料
                this.tempProduct = { ...product }; // 展開以避免在按下「確定」前就編輯
            }

        },

        // 編輯更新 + 新增 混合
        updateProduct() {
            // 原本 updateProduct 只使用 axios.post 做「新增」功能，為了也加上「編輯」功能，因此使用 isNew 來加入此一需求

            // 用 isNew 來判斷 api 如何運行：要行使「編輯更新」或「新增」的行為
            let url = `${apiUrl}v2/api/${apiPath}/admin/product`
            let method = 'post'

            if (!this.isNew) {
                // 如果 this.isNew=true，跑 else 的部分，執行「新增」功能 (post)，帶入 85-86 行變數
                url = `${apiUrl}v2/api/${apiPath}/admin/product/${this.tempProduct.id}`
                method = 'put'

            }
            // 如果是 this.isNew=false，則跑 if 裡的程式，做「編輯」行為，取 put api，
            axios[method](url, { data: this.tempProduct })
                .then((res) => {
                    // 更新後重新取得 products
                    this.getProducts();
                    productModal.hide();
                })
                .catch((err) => {
                    console.log(err)
                })

        }


    },
    mounted() {

        // 當 DOM 元件準備好後，就將先前登入時存入 cookie 的 token 取出
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)krisToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        // 當以 axios 發出請求時，將 headers 預設的欄位 Authorization 帶入 token 的值，每次只要運行 axios 時，就帶入這段預設
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();

        // 建立 bs
        // 1. 初始化 new
        // 2. 呼叫方法：.show(), .hide()...
        // console.log(bootstrap)
        productModal = new bootstrap.Modal('#productModal');

    }

}

createApp(app).mount('#app');