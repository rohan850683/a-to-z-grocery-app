const getOrderItemsHtml = (items = []) => {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eeeeee;">
            ${item.name || "Product"}
          </td>

          <td style="padding:12px;border-bottom:1px solid #eeeeee;text-align:center;">
            ${item.quantity || 1}
          </td>

          <td style="padding:12px;border-bottom:1px solid #eeeeee;text-align:right;">
            ₹${item.price || 0}
          </td>
        </tr>
      `
    )
    .join("");
};

const emailLayout = ({ title, message, order, statusText }) => {
  const orderId = order?._id ? order._id.toString() : "N/A";
  const totalAmount = order?.totalAmount || 0;
  const paymentMethod = order?.paymentMethod || "N/A";
  const deliveryAddress = order?.deliveryAddress || "N/A";
  const items = order?.items || [];

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>

      <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
        <div style="max-width:650px;margin:30px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">

          <div style="background:#16a34a;color:#ffffff;padding:24px;text-align:center;">
            <h1 style="margin:0;font-size:28px;">A to Z Grocery</h1>
            <p style="margin:8px 0 0;">Fresh groceries delivered to your door</p>
          </div>

          <div style="padding:30px;">
            <h2 style="margin-top:0;color:#222222;">${title}</h2>

            <p style="font-size:16px;line-height:1.6;color:#555555;">
              ${message}
            </p>

            <div style="background:#f0fdf4;border-left:5px solid #16a34a;padding:16px;margin:20px 0;border-radius:6px;">
              <strong>Order Status:</strong> ${statusText}
            </div>

            <table style="width:100%;border-collapse:collapse;margin-top:20px;">
              <tr>
                <td style="padding:8px 0;color:#666666;">Order ID</td>
                <td style="padding:8px 0;text-align:right;font-weight:bold;">
                  ${orderId}
                </td>
              </tr>

              <tr>
                <td style="padding:8px 0;color:#666666;">Payment Method</td>
                <td style="padding:8px 0;text-align:right;font-weight:bold;">
                  ${paymentMethod}
                </td>
              </tr>

              <tr>
                <td style="padding:8px 0;color:#666666;">Delivery Address</td>
                <td style="padding:8px 0;text-align:right;font-weight:bold;">
                  ${deliveryAddress}
                </td>
              </tr>
            </table>

            <h3 style="margin-top:30px;color:#222222;">Order Items</h3>

            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f8f8f8;">
                  <th style="padding:12px;text-align:left;">Product</th>
                  <th style="padding:12px;text-align:center;">Qty</th>
                  <th style="padding:12px;text-align:right;">Price</th>
                </tr>
              </thead>

              <tbody>
                ${getOrderItemsHtml(items)}
              </tbody>
            </table>

            <div style="margin-top:25px;text-align:right;font-size:20px;font-weight:bold;color:#16a34a;">
              Total: ₹${totalAmount}
            </div>
          </div>

          <div style="background:#111827;color:#ffffff;text-align:center;padding:18px;font-size:14px;">
            Thank you for shopping with A to Z Grocery.
          </div>
        </div>
      </body>
    </html>
  `;
};

const orderPlacedTemplate = (order) => {
  return emailLayout({
    title: "Order Placed Successfully",
    message:
      "Your order has been received successfully. We are preparing it for delivery.",
    order,
    statusText: "Placed",
  });
};

const orderStatusTemplate = (order, status) => {
  return emailLayout({
    title: "Order Status Updated",
    message: `Your order status has been updated to ${status}.`,
    order,
    statusText: status,
  });
};

const orderDeliveredTemplate = (order) => {
  return emailLayout({
    title: "Order Delivered Successfully",
    message:
      "Your order has been delivered successfully. We hope you enjoyed shopping with us.",
    order,
    statusText: "Delivered",
  });
};

module.exports = {
  orderPlacedTemplate,
  orderStatusTemplate,
  orderDeliveredTemplate,
};