const Comments = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <p>no comments</p>
  }

  return (
    <div>
      <ul>
        {comments.map((comment, i) => (
          <li key={i}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default Comments
