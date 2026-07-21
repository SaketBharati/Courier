import PDFDocument from "pdfkit";

/**
 * Generate and stream a PDF containing parcel details.
 *
 * @param {Array<Object>} parcels
 * @param {Response} res
 * @param {string} agentEmail
 */
export const generateAgentParcelPDF = (
  parcels,
  res,
  agentEmail
) => {
  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=parcels.pdf"
  );

  doc.pipe(res);

  // Title
  doc
    .fontSize(18)
    .text(`Parcels Assigned to: ${agentEmail}`, {
      align: "center",
    });

  doc.moveDown(2);

  if (!parcels.length) {
    doc
      .fontSize(12)
      .text("No parcels assigned.");

    doc.end();
    return;
  }

  parcels.forEach((parcel, index) => {
    doc
      .fontSize(14)
      .text(`Parcel ${index + 1}`, {
        underline: true,
      });

    doc.moveDown(0.5);

    doc.fontSize(11);

    doc.text(`Customer: ${parcel.customerEmail || "-"}`);
    doc.text(`Status: ${parcel.status || "-"}`);
    doc.text(`Pickup: ${parcel.pickupAddress || "-"}`);
    doc.text(`Delivery: ${parcel.deliveryAddress || "-"}`);
    doc.text(`Delivery Date: ${parcel.deliveryDate || "-"}`);
    doc.text(`Parcel Type: ${parcel.parcelType || "-"}`);
    doc.text(`Size: ${parcel.size || "-"}`);
    doc.text(`Price: ${parcel.price || "-"}`);
    doc.text(`Payment: ${parcel.paymentType || "-"}`);
    doc.text(`Barcode: ${parcel.barcode || "-"}`);

    doc.moveDown();

    if (index !== parcels.length - 1) {
      doc
        .moveTo(40, doc.y)
        .lineTo(555, doc.y)
        .stroke();

      doc.moveDown();
    }
  });

  doc.end();
};