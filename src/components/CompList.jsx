import { Link } from "react-router-dom";

const CompList = ({ components }) => {
  return (
    <div className="component-list">
      {components.map((component) => (
        <div className="component-preview" key={component.problemID}>
          <Link to={`/ide/${component.problemID}`}>
            <h2>{component.problemHeader}</h2>
          </Link>
          <div className="topics">
            {Object.entries(component.topics)
              .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Sort by key
              .map(([key, value], index) => (
                <p key={index}>{key}</p>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompList;
