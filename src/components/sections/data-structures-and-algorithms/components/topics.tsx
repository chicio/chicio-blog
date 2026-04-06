import { getAllDataStructuresAndAlgorithmsTopics } from "@/lib/content/data-structures-and-algorithms";
import { FC } from "react";

export const Topics: FC = () => {
  const topics = getAllDataStructuresAndAlgorithmsTopics();

  return (
    <div id="test" className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th className="w-2/5">Topic</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((topic) => (
            <tr key={topic.slug.formatted}>
              <td className="w-2/5">
                <a href={topic.slug.formatted}><strong>{topic.frontmatter.title}</strong></a>
              </td>
              <td>{topic.frontmatter.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
