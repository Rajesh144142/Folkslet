import React from "react";
const ShowComments = ({ postcomment }) => {
  return (
    <div className="flex flex-col gap-3 p-2  ">

      {postcomment !== undefined ? (
        postcomment.length !== 0 ? (
          postcomment.map((value, index) => (
            <div key={index} className="flex gap-2">
              <h1 className="font-semibold">{value.username} says:</h1>
              <p>{value.message}</p>
            </div>
          ))
        ) : (
          "No comments yet"
        )
      ) : (
        "No comments yet"
      )}
    </div>
  );
};

export default ShowComments;
