import { toast } from "react-hot-toast";

export const likeMovie = async (movieId, user, fetchData, baseApiUrl) => {
  if (!user) {
    toast.error("Please login to like movies");
    return { success: false, error: "User not logged in" };
  }

  try {
    const token = await user.getIdToken();
    const response = await fetchData(`${baseApiUrl}api/user/likes`, {
      method: "POST",
      body: JSON.stringify({ tmdb_id: movieId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Like Movie Response:", response); // Debug log

    if (response.message === "Movie liked") {
      toast.success("Movie liked!");
      return { success: true, like_id: response.like_id };
    }
    throw new Error("Unexpected response from server");
  } catch (error) {
    if (error.response?.status === 409) {
      toast("Movie already liked", { icon: "ℹ️" });
      return { success: true, alreadyLiked: true };
    }
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
    } else {
      toast.error("Failed to like movie.");
    }
    return { success: false, error: error.message };
  }
};

export const dislikeMovie = async (movieId, user, fetchData, baseApiUrl) => {
  if (!user) {
    toast.error("Please login to unlike movies");
    return { success: false, error: "User not logged in" };
  }

  try {
    const token = await user.getIdToken();
    const response = await fetchData(`${baseApiUrl}api/user/likes/${movieId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.message === "Like removed") {
      toast.success("Movie unliked!");
      return { success: true };
    }
    throw new Error("Unexpected response from server");
  } catch (error) {
    if (error.response?.status === 404) {
      toast("Movie not in your likes", { icon: "ℹ️" });
      return { success: false, error: "Like not found" };
    }
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
    } else {
      toast.error("Failed to unlike movie.");
    }
    return { success: false, error: error.message };
  }
};

export const toggleLike = async (movieId, isLiked, user, fetchData, baseApiUrl) => {
  return isLiked
    ? await dislikeMovie(movieId, user, fetchData, baseApiUrl)
    : await likeMovie(movieId, user, fetchData, baseApiUrl);
};