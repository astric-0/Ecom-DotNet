const Loading = ({ message }) => {
    return <h1>{ message }</h1>    
}

Loading.defaultProps = {
    message: "Loading..."
}

export default Loading;