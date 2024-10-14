/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// Modernized TransactionModal Component with Close Button
import Modal from "react-modal";
import { Check, MessageSquare, X } from "lucide-react";
import "animate.css";
import { toast } from "react-hot-toast"
import convertISOToDate from "../../utils/formatDate";
import { useSelector } from "react-redux"
import axios from "axios";
import { useState } from "react";

const customModalStyles = {
  content: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '85vh',
    overflow: 'auto',
    backgroundColor: '#1a1b1f',
    borderRadius: '20px',
    border: 'none',
    padding: '30px',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.6)',
    zIndex: 1000,
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 999,
  },
};

const TransactionModal = ({ isOpen, onRequestClose, transaction, openConfirmationPopup }) => {

  const [commentForm, setCommentForm] = useState({
    expenseId: '',
    commentText: '',
  })
  const [transactionId, setTransactionId] = useState('')
  const userDetails = useSelector(state => state.AuthSlice?.user);

  console.log(transaction)

  const handleCreateComment = async (e) => {
    if (!commentForm.commentText.trim()) return;
    const response = await axios.post('http://localhost:4000/api/expense/createComment', commentForm, { withCredentials: true })

    console.log("created comment")

    if (response.data) {
      setCommentForm({ ...commentForm, commentText: '' })
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customModalStyles}
      contentLabel="Transaction Details"
      className="animate__animated animate__fadeIn animate__faster"
    >
      {transaction && (
        <div className="text-white relative">
          {/* Close Button */}
          <button
            onClick={onRequestClose}
            className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition duration-200"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-bold mb-6 text-center">Transaction Details</h2>
          <div className="mb-6 p-6 rounded-lg bg-gray-900 shadow-lg">
            <p className="text-base mb-3"><strong>Transaction ID:</strong> {transaction._id}</p>
            <p className="text-base mb-3"><strong>Date:</strong> {convertISOToDate(transaction.updatedAt)}</p>
            <p className="text-base mb-3"><strong>SubHead:</strong> {transaction.subHead}</p>
            <p className="text-base mb-3"><strong>Total:</strong> ₹ {parseInt(transaction.total).toFixed(2)}</p>
            <p className="text-base mb-3"><strong>Status:</strong> {transaction.status}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Comments</h3>
            <ul>
              {
                transaction?.comments.length > 0 ? transaction?.comments.map(comment => (
                  <li key={comment?._id} className="p-3 bg-gray-900 rounded-md">
                    <p className="text-base">
                      <strong>{
                        String(comment.userRole).charAt(0).toUpperCase() + String(comment.userRole).slice(1)
                      }:</strong>
                      {comment?.commentText || ''}
                    </p>
                  </li>
                )) :
                  <p>
                    No comments yet
                  </p>
              }
            </ul>

            <div className="mb-8">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentForm.commentText}
                  onChange={(e) => setCommentForm({ expenseId: transaction?._id, commentText: e.target.value })}
                  className="flex-grow px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write a comment..."
                />
                <button
                  onClick={handleCreateComment}
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition duration-200"
                >
                  <MessageSquare size={20} />
                </button>
              </div>
              {
                (userDetails.role == 'accountant' && transaction?.status == 'approved') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Add Txn ID</label>
                    <input
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Enter Transaction ID..."
                    />
                  </div>
                )
              }
            </div>

            {
              userDetails?.role != 'admin' && (
                <div className="flex justify-center gap-6">

                  {
                    userDetails?.role == 'accountant' ?
                      (
                        <button
                          onClick={() => openConfirmationPopup('completed')}
                          className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full gap-2 shadow-lg hover:shadow-xl transition duration-200"
                        >
                          <Check size={20} />
                          Complete Transaction
                        </button>
                      ) :
                      userDetails?.role == 'bursar' ?
                        (
                          <button
                            onClick={() => openConfirmationPopup('verified')}
                            className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full gap-2 shadow-lg hover:shadow-xl transition duration-200"
                          >
                            <Check size={20} />
                            Verify Transaction
                          </button>
                        ) :
                        (
                          <button
                            onClick={() => openConfirmationPopup('approved')}
                            className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full gap-2 shadow-lg hover:shadow-xl transition duration-200"
                          >
                            <Check size={20} />
                            Approve Transaction
                          </button>
                        )
                  }
                  <button
                    onClick={() => openConfirmationPopup('reject')}
                    className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full gap-2 shadow-lg hover:shadow-xl transition duration-200"
                  >
                    <X size={20} /> Reject Transaction
                  </button>
                </div>
              )
            }
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TransactionModal;