import React, { useState } from "react";
import { Modal, Form, Input, Checkbox, Typography } from "antd";

const { Link } = Typography;

export const PaymentMethodModal = ({
  modalVisible,
  setModalVisible,
  selectedPayment,
  handleModalOk,
  modalForm,
  termsAccepted,
  setTermsAccepted,
}) => {
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  // Terms and Conditions text per payment method
  const termsContent = {
    bank: (
      <>
        <p><strong>Bank Transfer Terms:</strong></p>
        <p>
          Please ensure you transfer the exact amount to the provided bank account.
          Keep your transaction reference ID handy for verification. Orders will be processed
          once payment is confirmed.
        </p>
      </>
    ),
    card: (
      <>
        <p><strong>Credit/Debit Card Terms:</strong></p>
        <p>
          Your card will be charged at the time of order confirmation. Please ensure your card
          details are accurate. In case of any dispute, contact your card issuer.
        </p>
      </>
    ),
    easypaisa: (
      <>
        <p><strong>Easypaisa / JazzCash Terms:</strong></p>
        <p>
          Please make sure to complete your transaction through the wallet app and enter the
          correct transaction ID here. Payment confirmation may take a few minutes.
        </p>
      </>
    ),
    gpay: (
      <>
        <p><strong>Google Pay Terms:</strong></p>
        <p>
          Complete your payment via Google Pay and enter the transaction ID here. Ensure the
          transaction is successful before confirming your order.
        </p>
      </>
    ),
  };

  // Render form fields based on payment type
  const renderFields = () => {
    if (selectedPayment === "bank") {
      return (
        <>
          <Form.Item
            label="Bank Name"
            name="bankName"
            rules={[{ required: true, message: "Enter bank name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Account Number"
            name="accountNumber"
            rules={[{ required: true, message: "Enter account number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Reference ID"
            name="refId"
            rules={[{ required: true, message: "Enter transaction ID" }]}
          >
            <Input />
          </Form.Item>
        </>
      );
    } else if (selectedPayment === "easypaisa") {
      return (
        <>
          <Form.Item
            label="Wallet Account Number"
            name="walletAccountNumber"
            rules={[{ required: true, message: "Enter wallet account number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Transaction ID"
            name="transactionId"
            rules={[{ required: true, message: "Enter transaction ID" }]}
          >
            <Input />
          </Form.Item>
        </>
      );
    } else if (["card", "gpay"].includes(selectedPayment)) {
      return (
        <>
          <Form.Item
            label="Transaction ID"
            name="transactionId"
            rules={[{ required: true, message: "Enter transaction ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mobile Number (if applicable)" name="mobile">
            <Input />
          </Form.Item>
        </>
      );
    }
    return null;
  };

  return (
    <>
      {/* Main Payment Modal */}
      <Modal
        title={`Complete Payment - ${
          selectedPayment === "bank"
            ? "Bank Transfer"
            : selectedPayment === "card"
            ? "Credit/Debit Card"
            : selectedPayment === "easypaisa"
            ? "Easypaisa / JazzCash"
            : "Google Pay"
        }`}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          modalForm.resetFields();
          setTermsAccepted(false);
        }}
        okText="Confirm Payment"
      >
        <Form layout="vertical" form={modalForm}>
          {renderFields()}

          <Form.Item>
            <Checkbox
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            >
              I agree to the{" "}
              <Link
                onClick={() => setTermsModalVisible(true)}
                style={{ cursor: "pointer" }}
              >
                Terms and Conditions
              </Link>
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      {/* Terms and Conditions Modal */}
      <Modal
        title="Terms and Conditions"
        open={termsModalVisible}
        footer={null}
        onCancel={() => setTermsModalVisible(false)}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {termsContent[selectedPayment] || (
            <p>No specific terms and conditions for this payment method.</p>
          )}
        </div>
      </Modal>
    </>
  );
};
