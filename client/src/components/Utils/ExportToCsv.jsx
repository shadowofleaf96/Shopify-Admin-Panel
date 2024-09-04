import React from 'react';

const DownloadtoCSV = (data, fileName) => {
    if (fileName.includes("Products")) {
        const convertToCSV = (objArray) => {
            const headers = ["ID", "Name", "Category", "Price", "Inventory Stock", "Vendor", "Status"];
            let str = headers.join(',') + '\r\n';

            objArray.forEach(product => {
                const line = [
                    `"${product.id}"`,
                    `"${product.title}"`,
                    `"${product.product_type}"`,
                    `"${product.variants[0]?.price || ''}"`,
                    `"${product.variants[0]?.inventory_quantity || ''}"`,
                    `"${product.vendor}"`,
                    `"${product.status.charAt(0).toUpperCase() + product.status.slice(1)}"`
                ].join(',');

                str += line + '\r\n';
            });

            return str;
        };
        const csvData = new Blob([convertToCSV(data)], { type: 'text/csv' });
        const csvURL = URL.createObjectURL(csvData);
        const link = document.createElement('a');
        link.href = csvURL;
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        if (fileName.includes("Orders")) {
            const convertToCSV = (objArray) => {
                const headers = ["Order ID", "Email", "Name", "Mobile Number", "Shipping Address", "Price", "Fulfillement"];
                let str = headers.join(',') + '\r\n';

                objArray.forEach(order => {
                    const line = [
                        `"${order.id}"`,
                        `"${order.email}"`,
                        `"${order.shipping_address?.first_name} ${order.shipping_address?.last_name}"`,
                        `"${order.phone}"`,
                        `"${order.shipping_address?.address1} ${order?.shipping_address?.address2} ${order?.shipping_address?.city}"`,
                        `"${order.total_price}"`,
                        `"${order.fulfillment_status}"`
                    ].join(',');

                    str += line + '\r\n';
                });

                return str;
            };
            const csvData = new Blob([convertToCSV(data)], { type: 'text/csv' });
            const csvURL = URL.createObjectURL(csvData);
            const link = document.createElement('a');
            link.href = csvURL;
            link.download = `${fileName}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

export default DownloadtoCSV;
