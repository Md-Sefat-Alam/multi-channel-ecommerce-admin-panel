# Multi-Channel E-commerce Platform - Admin Panel

A comprehensive admin dashboard for managing multi-channel e-commerce operations, featuring SSActiveWear integration, Shopify deployment, real-time analytics, and inventory synchronization.

## 🚀 Features

- **Multi-Channel Management**: Unified control panel for all sales channels
- **SSActiveWear Integration**: Product import and inventory synchronization
- **Shopify Deployment**: One-click product deployment to Shopify stores
- **Real-time Analytics**: Interactive charts and business insights
- **Inventory Monitoring**: Live inventory tracking across all platforms
- **Product Management**: Bulk import/export, variant management
- **Order Management**: Centralized order processing and tracking
- **Drag & Drop Interface**: Intuitive product and category management
- **Advanced Reporting**: Sales analytics and performance metrics

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS + Ant Design
- **Charts**: Ant Design Plots + React ApexCharts
- **State Management**: Redux Toolkit
- **Drag & Drop**: DND Kit
- **Real-time Communication**: Socket.IO
- **Rich Text Editor**: React Quill with image resize
- **Themes**: Dark/Light mode support
- **Icons**: Ant Design Icons, Lucide React, React Icons

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Md-Sefat-Alam/multi-channel-ecommerce-admin-panel.git
cd multi-channel-ecommerce-admin-panel
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_SSACTIVEWEAR_API_URL=ssactivewear_api_url
NEXT_PUBLIC_SHOPIFY_API_URL=shopify_api_url
NEXT_PUBLIC_SOCKET_URL=socket_server_url
# Add other required environment variables
```

## 🏃‍♂️ Getting Started

### Development
```bash
npm run dev
```
Admin panel will be available at [http://localhost:3001](http://localhost:3001)

### Turbo Mode (Faster Development)
```bash
npm run turbo
```

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # Reusable admin components
│   ├── charts/         # Analytics and reporting charts
│   ├── forms/          # Product and inventory forms
│   ├── tables/         # Data management tables
│   └── modals/         # Dialog components
├── hooks/              # Custom admin hooks
├── lib/                # Utility functions and API clients
├── store/              # Redux store with admin slices
├── styles/             # Admin-specific styles
└── types/              # TypeScript definitions
```

## 🔧 Key Dependencies

- **Ant Design**: Enterprise admin UI components
- **@ant-design/plots**: Advanced data visualization
- **DND Kit**: Drag and drop functionality
- **React ApexCharts**: Interactive charts and graphs
- **Socket.IO**: Real-time updates and notifications
- **React Quill**: Rich text editor for product descriptions
- **Next Themes**: Dark/light mode switching

## 🌟 Core Admin Features

### Product Management
- **Import Wizard**: Bulk product import from SSActiveWear
- **Variant Management**: Handle size, color, style variations
- **Bulk Operations**: Mass edit, update, and delete products
- **Category Management**: Drag & drop category organization
- **Image Management**: Upload, crop, and optimize product images

### Multi-Channel Operations
- **SSActiveWear Integration**: 
  - Real-time product catalog sync
  - Inventory level monitoring
  - Automated price updates
- **Shopify Deployment**:
  - One-click product publishing
  - Collection management
  - Tag synchronization

### Analytics Dashboard
- **Sales Metrics**: Revenue, orders, conversion rates
- **Inventory Analytics**: Stock levels, turnover rates
- **Channel Performance**: Multi-platform comparison
- **Real-time Updates**: Live data with Socket.IO

### Inventory Management
- **Real-time Sync**: Automatic inventory updates across channels
- **Low Stock Alerts**: Configurable inventory warnings
- **Audit Trail**: Complete inventory change history
- **Bulk Updates**: Mass inventory adjustments

## 🔗 API Integration

### SSActiveWear API
- Product catalog import
- Real-time inventory synchronization
- Category and variant mapping
- Image and description sync

### Shopify Admin API
- Product creation and updates
- Inventory level management
- Order webhook processing
- Collection and tag management

### Backend API
- User authentication and authorization
- Product data management
- Order processing
- Analytics data aggregation

## 📊 Dashboard Components

- **Overview Dashboard**: Key metrics and KPIs
- **Product Management**: CRUD operations with advanced filtering
- **Order Management**: Order processing and fulfillment
- **Analytics**: Interactive charts and reports
- **Settings**: System configuration and preferences
- **User Management**: Admin user roles and permissions

## 🎨 UI/UX Features

- **Responsive Design**: Optimized for desktop and tablet
- **Dark/Light Theme**: User preference theme switching
- **Drag & Drop**: Intuitive product and category management
- **Advanced Tables**: Sorting, filtering, and pagination
- **Modal Workflows**: Streamlined data entry processes
- **Print Support**: Generate reports and documents

## ⚡ Real-time Features

- **Live Inventory Updates**: Socket.IO powered real-time sync
- **Order Notifications**: Instant order alerts
- **System Status**: Live API connection monitoring
- **User Activity**: Real-time admin user tracking

## 🚀 Deployment

Optimized for deployment on:
- **Vercel**: Recommended for Next.js applications
- **Digital Ocean**: Docker container deployment
- **AWS**: EC2 or ECS deployment
- **Heroku**: Platform-as-a-Service deployment

## 🔐 Security Features

- **Role-based Access**: Admin user permission management
- **API Rate Limiting**: Protected API endpoints
- **Data Validation**: Input sanitization and validation
- **Secure Authentication**: Token-based auth system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/admin-enhancement`
3. Make your changes and commit: `git commit -m 'Add new admin feature'`
4. Push to the branch: `git push origin feature/admin-enhancement`
5. Submit a pull request

## 📄 License

This project is part of the Yupsis Full-Stack Engineering Assessment.

---

**Developer**: Md. Sefat Alam  
**Contact**: md.sefatalam@gmail.com  
**Phone**: +8801774199968