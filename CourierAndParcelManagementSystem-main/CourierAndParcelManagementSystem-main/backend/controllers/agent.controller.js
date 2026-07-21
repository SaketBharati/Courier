import * as agentService from "../services/agent.service.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import stream from "stream";

// =====================================
// Get Assigned Parcels
// =====================================
export const getAssignedParcels = async (req, res) => {
  try {
    const parcels = await agentService.getAssignedParcels(
      req.decoded.email
    );

    res.status(200).json({
      success: true,
      parcels,
    });
  } catch (err) {
    console.error("Get Assigned Parcels Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// =====================================
// Update Parcel Status
// =====================================
export const updateParcelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Picked Up",
      "In Transit",
      "Delivered",
      "Failed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parcel status.",
      });
    }

    const result = await agentService.updateParcelStatus(
      id,
      req.decoded.email,
      status
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parcel status updated successfully.",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Update Parcel Status Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// =====================================
// Update Parcel Location
// =====================================
export const updateParcelLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required.",
      });
    }

    const result = await agentService.updateParcelLocation(
      id,
      req.decoded.email,
      lat,
      lng
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parcel location updated successfully.",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Update Parcel Location Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// =====================================
// Export Parcels as CSV
// =====================================
export const exportParcelsCSV = async (req, res) => {
  try {
    const parcels = await agentService.getParcelsForExport(
      req.decoded.email
    );

    if (!parcels.length) {
      return res.status(404).json({
        success: false,
        message: "No parcels available for export.",
      });
    }

    const fields = [
      "customerEmail",
      "contact",
      "pickupAddress",
      "deliveryAddress",
      "deliveryDate",
      "parcelType",
      "size",
      "paymentType",
      "price",
      "status",
      "agentEmail",
      "deliveryInstructions",
      "barcode",
      "createdAt",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(parcels);

    res.header("Content-Type", "text/csv");
    res.attachment("parcels.csv");
    res.send(csv);
  } catch (err) {
    console.error("CSV Export Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to export CSV.",
    });
  }
};

// =====================================
// Export Parcels as PDF
// =====================================
export const exportParcelsPDF = async (req, res) => {
  try {
    const parcels = await agentService.getParcelsForExport(
      req.decoded.email
    );

    if (!parcels.length) {
      return res.status(404).json({
        success: false,
        message: "No parcels available for export.",
      });
    }

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    const bufferStream = new stream.PassThrough();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=parcels.pdf"
    );

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    doc.pipe(bufferStream);
    bufferStream.pipe(res);

    doc
      .fontSize(18)
      .text(
        `Parcels Assigned to: ${req.decoded.email}`,
        {
          align: "center",
        }
      )
      .moveDown(2);

    // Keep your existing PDF table drawing logic here

    doc.end();
  } catch (err) {
    console.error("PDF Export Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to export PDF.",
    });
  }
};