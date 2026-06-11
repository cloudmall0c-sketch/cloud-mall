# 🛍️ Cloud Mall - Multi-Vendor Clothing Marketplace

منصة متخصصة لبيع الملابس بنموذج متعدد البائعين (Multi-Vendor Marketplace)

## ✨ الميزات الرئيسية

### 👥 للعملاء (Customers)
- ✅ تسجيل حساب جديد وتسجيل دخول
- ✅ تصفح جميع متاجر الملابس
- ✅ البحث والتصفية حسب النوع واللون والحجم
- ✅ عرض التفاصيل الكاملة للمنتج
- ✅ إضافة المنتجات للسلة والشراء
- ✅ تتبع الطلبات
- ✅ تقييم المنتجات والمتاجر

### 🏪 لأصحاب المتاجر (Store Owners)
- ✅ تسجيل متجر جديد وتسجيل دخول
- ✅ إضافة وتحرير المنتجات (الملابس)
- ✅ إدارة المخزون (الكميات المتاحة)
- ✅ إنشاء عروضات خصم (تحديد نسبة الخصم والتاريخ)
- ✅ تغيير الأسعار بسهولة
- ✅ عرض الطلبات المستقبلة
- ✅ تحديث حالة الطلبات (قيد المعالجة، مشحون، وصل)
- ✅ مشاهدة إحصائيات المبيعات والإيرادات
- ✅ تحديث بيانات المتجر (الصورة، الوصف)

### 👨‍💼 للمسؤول الأساسي (Admin)
- ✅ بريد المسؤول المخصص: `000@gmail.com`
- ✅ كلمة المرور: `000`
- ✅ التحكم الكامل بجميع المتاجر
- ✅ تحديد نسبة ظهور كل متجر (0-100%)
- ✅ تفعيل/تعطيل المتاجر
- ✅ عرض تحليلات مفصلة لكل متجر:
  - عدد المنتجات المباعة
  - الإيرادات الإجمالية
  - عدد الطلبات
  - تقييم المتجر
- ✅ عرض إحصائيات المنصة الكاملة

## 🛠️ التكنولوجيا المستخدمة

### Backend
- **Node.js** - بيئة التشغيل
- **Express.js** - Web framework
- **MongoDB** - قاعدة البيانات
- **Mongoose** - مكتبة لإدارة قاعدة البيانات
- **JWT** - للمصادقة الآمنة
- **bcryptjs** - تشفير كلمات المرور

### Frontend (ستتم إضافته لاحقاً)
- **React.js** - واجهة المستخدم
- **React Router** - التوجيه بين الصفحات
- **Axios** - requests للـ API
- **Tailwind CSS** - تصميم واستجابة الواجهة

## 📁 هيكل المشروع

```
cloud-mall/
├── models/              # قاعدة البيانات (Schemas)
│   ├── User.js          # نموذج العميل
│   ├── Store.js         # نموذج المتجر
│   ├── Product.js       # نموذج المنتج
│   └── Order.js         # نموذج الطلب
├── routes/              # API Routes
│   ├── auth.js          # المصادقة
│   ├── stores.js        # إدارة المتاجر
│   ├── products.js      # إدارة المنتجات
│   ├── admin.js         # لوحة التحكم
│   └── orders.js        # إدارة الطلبات
├── middleware/          # Middleware
│   └── auth.js          # التحقق من الصلاحيات
├── server.js            # الملف الرئيسي للخادم
├── package.json         # المتطلبات
└── .env.example         # متغيرات البيئة
```

## 🚀 البدء السريع

### المتطلبات المسبقة
- Node.js v14+
- MongoDB (محلي أو في السحابة)

### التثبيت

1. **استنساخ المستودع**
```bash
git clone https://github.com/cloudmall0c-sketch/cloud-mall.git
cd cloud-mall
```

2. **تثبيت المتطلبات**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env
```

ثم حرر ملف `.env` وأضف:
```
MONGODB_URI=mongodb://localhost:27017/cloud-mall
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=000@gmail.com
ADMIN_PASSWORD=000
```

4. **تشغيل الخادم**
```bash
npm run dev
```

الخادم سيعمل على `http://localhost:5000`

## 📡 نقاط نهاية API

### المصادقة (Authentication)

#### تسجيل عميل جديد
```
POST /api/auth/customer/register
Body: {
  name, email, password, confirmPassword
}
```

#### دخول عميل
```
POST /api/auth/customer/login
Body: { email, password }
```

#### تسجيل متجر جديد
```
POST /api/auth/store/register
Body: {
  name, email, password, confirmPassword, phone, address
}
```

#### دخول متجر
```
POST /api/auth/store/login
Body: { email, password }
```

#### دخول مسؤول
```
POST /api/auth/admin/login
Body: {
  email: "000@gmail.com",
  password: "000"
}
```

### المتاجر (Stores)

#### الحصول على جميع المتاجر
```
GET /api/stores
```

#### إضافة/تحديث عرض المتجر
```
POST /api/stores/:storeId/visibility
Headers: Authorization: Bearer token
Body: { visibilityPercentage: 50-100 }
```

### المنتجات (Products)

#### الحصول على جميع المنتجات
```
GET /api/products
Query: ?category=Men&storeId=123&search=shirt
```

#### إضافة منتج جديد (متجر فقط)
```
POST /api/products
Headers: Authorization: Bearer token
Body: {
  name, description, price, category, sizes, colors, stock, material, brand
}
```

#### تحديث منتج
```
PUT /api/products/:id
Headers: Authorization: Bearer token
Body: { name, description, price, stock, sizes, colors }
```

#### إضافة عرض على منتج
```
POST /api/products/:id/offer
Headers: Authorization: Bearer token
Body: {
  offerPercentage: 20,
  offerStartDate: "2026-01-01",
  offerEndDate: "2026-01-31"
}
```

#### إزالة العرض من منتج
```
POST /api/products/:id/remove-offer
Headers: Authorization: Bearer token
```

### الطلبات (Orders)

#### إنشاء طلب جديد
```
POST /api/orders
Headers: Authorization: Bearer token
Body: {
  storeId, items, totalAmount, shippingAddress, paymentMethod
}
```

#### الحصول على طلبات العميل
```
GET /api/orders/customer
Headers: Authorization: Bearer token
```

#### الحصول على طلبات المتجر
```
GET /api/orders/store/:storeId
Headers: Authorization: Bearer token
```

#### تحديث حالة الطلب
```
PUT /api/orders/:orderId/status
Headers: Authorization: Bearer token
Body: { status: "confirmed|shipped|delivered|cancelled" }
```

### لوحة تحكم المسؤول (Admin)

#### الحصول على جميع المتاجر مع التحليلات
```
GET /api/admin/stores
Headers: Authorization: Bearer token
```

#### تحديث نسبة ظهور المتجر
```
PUT /api/admin/stores/:storeId/visibility
Headers: Authorization: Bearer token
Body: { visibilityPercentage: 75 }
```

#### تغيير حالة المتجر
```
PUT /api/admin/stores/:storeId/status
Headers: Authorization: Bearer token
Body: { isActive: true/false }
```

#### عرض تحليلات المتجر
```
GET /api/admin/stores/:storeId/analytics
Headers: Authorization: Bearer token
```

#### عرض إحصائيات المنصة
```
GET /api/admin/analytics/overview
Headers: Authorization: Bearer token
```

## 📊 نموذج البيانات

### العميل (User)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (فريد),
  password: String (مشفرة),
  phone: String,
  address: String,
  role: "customer",
  profileImage: String,
  createdAt: Date
}
```

### المتجر (Store)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (فريد),
  password: String (مشفرة),
  description: String,
  logo: String,
  banner: String,
  phone: String,
  address: String,
  visibilityPercentage: Number (0-100),
  isActive: Boolean,
  totalSales: Number,
  totalProductsSold: Number,
  totalRevenue: Number,
  rating: Number (0-5),
  reviewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### المنتج (Product)
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: "Men|Women|Kids|Accessories",
  sizes: [String],
  colors: [String],
  images: [String],
  storeId: ObjectId (مرجع للمتجر),
  stock: Number,
  hasOffer: Boolean,
  offerPercentage: Number (0-100),
  offerStartDate: Date,
  offerEndDate: Date,
  material: String,
  brand: String,
  rating: Number (0-5),
  reviewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### الطلب (Order)
```javascript
{
  _id: ObjectId,
  orderNumber: String (فريد),
  customerId: ObjectId,
  storeId: ObjectId,
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    size: String,
    color: String
  }],
  totalAmount: Number,
  status: "pending|confirmed|shipped|delivered|cancelled",
  paymentMethod: String,
  paymentStatus: "pending|completed|failed",
  shippingAddress: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 الأمان

- ✅ تشفير كلمات المرور باستخدام bcryptjs
- ✅ توثيق JWT للجلسات الآمنة
- ✅ التحقق من الصلاحيات على جميع العمليات
- ✅ فصل الأدوار (عميل، متجر، مسؤول)

## 🚧 الخطوات التالية

- [ ] بناء واجهة React للعملاء
- [ ] بناء لوحة تحكم المتاجر
- [ ] بناء لوحة تحكم المسؤول
- [ ] إضافة نظام الدفع
- [ ] إضافة نظام التقييمات والتعليقات
- [ ] إضافة نظام الإشعارات
- [ ] إضافة نظام البحث المتقدم

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة ISC

## 👨‍💻 المساهمة

نرحب بمساهماتك! يرجى عمل fork للمشروع وإرسال pull request

## 📧 التواصل

للأسئلة والاقتراحات: cloudmall0c-sketch@gmail.com

---

**Made with ❤️ by Cloud Mall Team**
