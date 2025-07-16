import { useParams, useNavigate } from "react-router";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import { useAuth } from "../auth/AuthContext";


export default function ActivityDetailsPage() {
  const { activityId } = useParams(); 
  const navigate = useNavigate();
  const { token } = useAuth();
  const { data, loading, error } = useQuery(`/activities/${activityId}`, "activity");

  const {
    mutate: deleteActivity,
    loading: deleteLoading,
    error: deleteError,
  } = useMutation("DELETE", `/activities/${activityId}`, ["activities"]);

  async function handleDelete() {
    try {
      await deleteActivity();
      navigate("/activities"); 
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }


  if (loading) return <p>Loading activity details...</p>;
  if (error) return <p>Error loading activity: {error.message}</p>;
  if (!data) return <p>No activity found.</p>;

  const { name, description, creator } = data;

  return (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>
      <p>
        <strong>Created by:</strong> {creator?.username || "Unknown"}
      </p>
      {token && (
        <button onClick={handleDelete}>
          {deleteLoading
            ? "Deleting..."
            : deleteError
            ? "Error deleting"
            : "Delete Activity"}
        </button>
      )}
    </div>
  );
}