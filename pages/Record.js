// components/Record.js
const Record = ({ url }) => {
    return (
      <div className="record">
        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
      </div>
    );
  };
  
  export default Record;
  