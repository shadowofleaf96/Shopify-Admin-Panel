import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import Error from "../Error/Error"
import { FaSpinner } from "react-icons/fa6";
import { BsCartFill, BsCartCheckFill, BsCartXFill, BsCartPlusFill } from "react-icons/bs";
import AxiosConfig from "../Utils/AxiosConfig";

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [productsInfo, setProductsInfo] = useState({
    total: 0,
    inStock: 0,
    outOfStock: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await AxiosConfig.get("/orders");
        const orders = ordersResponse.data.orders;
        setOrdersData(orders);

        const fulfilledOrders = orders.filter(order => order.fulfillment_status === "fulfilled");

        const salesByMonth = fulfilledOrders.reduce((acc, order) => {
          const date = new Date(order.created_at);
          const month = date.toLocaleString("default", { month: "long", year: "numeric" });
          if (!acc[month]) acc[month] = 0;
          acc[month] += parseFloat(order.total_price);
          return acc;
        }, {});

        const salesDataArray = Object.keys(salesByMonth).map(month => ({
          month,
          amount: salesByMonth[month],
        }));

        setSalesData(salesDataArray);

        const ordersByDate = orders.reduce((acc, order) => {
          const date = new Date(order.created_at).toISOString().split("T")[0];
          if (!acc[date]) acc[date] = 0;
          acc[date] += parseFloat(order.total_price);
          return acc;
        }, {});

        const ordersDataArray = Object.keys(ordersByDate).map(date => ({
          date: new Date(date).toLocaleDateString("default", { day: "2-digit", month: "short", year: "numeric" }),
          amount: ordersByDate[date],
        }));

        setOrdersData(ordersDataArray);

        const productsResponse = await AxiosConfig.get("/products");
        const products = productsResponse.data.products;
        const totalProducts = products.length;
        let inStock = 0;
        let outOfStock = 0;

        products.forEach(product => {
          const hasInStockVariant = product.variants.some(variant => variant.inventory_quantity > 0);
          if (hasInStockVariant) {
            inStock++;
          } else {
            outOfStock++;
          }
        });

        setProductsInfo({
          total: totalProducts,
          inStock,
          outOfStock,
          totalOrders: orders.length,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const barData = {
    labels: salesData.map(sale => sale.month),
    datasets: [
      {
        label: "Sales",
        data: salesData.map(sale => sale.amount),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const lineData = {
    labels: ordersData.map(order => order.date),
    datasets: [
      {
        label: "Orders",
        data: ordersData.map(order => order.amount),
        fill: true,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Error error={error} />
    )
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex hover:scale-105 transform transition duration-300 cursor-pointer">
            <div className="flex flex-col mr-4">
              <h3 className="text-lg font-medium mb-2">Total Products</h3>
              <p className="text-2xl font-semibold">{productsInfo.total}</p>
            </div>
            <div className="h-auto w-auto ml-auto my-auto">
              <BsCartFill size={44} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex hover:scale-105 transform transition duration-300 cursor-pointer">
            <div className="flex flex-col mr-4">
              <h3 className="text-lg font-medium mb-2">Product In Stock</h3>
              <p className="text-2xl font-semibold">{productsInfo.inStock}</p>
            </div>
            <div className="h-auto w-auto ml-auto my-auto">
              <BsCartPlusFill size={40} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex hover:scale-105 transform transition duration-300 cursor-pointer">
            <div className="flex flex-col mr-4">
              <h3 className="text-lg font-medium mb-2">Product Out of Stock</h3>
              <p className="text-2xl font-semibold">
                {productsInfo.outOfStock}
              </p>
            </div>
            <div className="h-auto w-auto ml-auto my-auto">
              <BsCartXFill size={40} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex hover:scale-105 transform transition duration-300 cursor-pointer">
            <div className="flex flex-col mr-4">
              <h3 className="text-lg font-medium mb-2">Total Orders</h3>
              <p className="text-2xl font-semibold">{productsInfo.totalOrders}</p>
            </div>
            <div className="h-auto w-auto ml-auto my-auto">
              <BsCartCheckFill size={40} className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Sales Overview</h2>
          <Bar data={barData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Orders Overview</h2>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
