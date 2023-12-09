import { Link } from "react-router-dom";

const CompList = ({ components, problemList }) => {
  return (
    <div className="component-list">
  {components
    .filter(component => problemList.includes(component.problemID)) 
    .map((component) => (
      <div className="component-preview" key={component.problemID}>
        <Link to={`/ide/${component.problemID}`}>
          <h2>{component.problemID}, {component.problemHeader}</h2>
        </Link>
        <div className="topics">
          {Object.entries(component.topics)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, value], index) => (
              value > 0 ? <p key={index}>{key} {console.log(key)}</p> : null
            ))}
        </div>
      </div>
    ))}
</div>

  );
};

export default CompList;
