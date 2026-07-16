import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateTicketMutation,
  useGetTicketsQuery,
} from "../../api/apiSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

const SupportPage = () => {
  const { t } = useTranslation();
  const {
    data: tickets,
    isLoading: ticketsLoading,
    refetch,
  } = useGetTicketsQuery();
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createTicket({ subject, message }).unwrap();
      setSubject("");
      setMessage("");
      refetch();
    } catch (err) {
      setError(err.data?.message || "Failed to create ticket");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("tickets")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create ticket form */}
        <div className="bg-white shadow-md p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">Create New Ticket</h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <div className="mb-4">
              <label className="label">Message</label>
              <textarea
                className="input"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? t("loading") : "Submit Ticket"}
            </Button>
          </form>
        </div>

        {/* List tickets */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
          {ticketsLoading ? (
            <Spinner />
          ) : tickets && tickets.length > 0 ? (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="border p-4 rounded shadow-sm">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{ticket.subject}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs ${ticket.status === "open" ? "bg-yellow-100" : ticket.status === "resolved" ? "bg-green-100" : "bg-gray-100"}`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{ticket.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tickets.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
