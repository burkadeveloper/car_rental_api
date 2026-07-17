import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
// import { fetchTickets, updateTicketStatus } from '../../features/notifications/notificationSlice';

const AdminTickets = () => {
  const dispatch = useDispatch();
  const { tickets, loading, error } = useSelector(
    (state) => state.notifications,
  );

  useEffect(() => {
    // dispatch(fetchTickets());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">Error loading tickets</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets?.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-6 py-4">#{ticket.id}</td>
                <td className="px-6 py-4">{ticket.userName}</td>
                <td className="px-6 py-4">{ticket.subject}</td>
                <td className="px-6 py-4 capitalize">{ticket.status}</td>
                <td className="px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      /* dispatch(updateTicketStatus({ id: ticket.id, status: 'resolved' })) */
                    }}
                  >
                    Resolve
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTickets;
