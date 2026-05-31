import PageFrame from "@components/layout/PageFrame";
import { Panel } from "@components/ui";

export default function SimplePage({ title, description }) {
  return (
    <PageFrame eyebrow={title} title={title} description={description}>
      <Panel className="page-card">
        <p className="page-section__text">This route is ready for the next backend command.</p>
      </Panel>
    </PageFrame>
  );
}
