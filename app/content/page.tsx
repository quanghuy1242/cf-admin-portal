import { withPageAuthRequired } from "@auth0/nextjs-auth0/edge";
import Title from "antd/lib/typography/Title";
import Table from "antd/lib/table";
import type {
  TableProps,
  ColumnsType as TableColumnsType,
} from "antd/lib/table";
import Link from "next/link";
import Flex from "antd/lib/flex";
import Button from "antd/lib/button";
import Search from "antd/lib/input/Search";

type TableRowSelection<T> = TableProps<T>["rowSelection"];

interface DataType {
  key: React.Key;
  title: unknown;
  id: number;
  createdBy: string;
  modified: string;
}

export default withPageAuthRequired(
  async function Home() {
    const columns: TableColumnsType<DataType> = [
      {
        title: "Title",
        dataIndex: "title",
        width: "300px",
      },
      {
        title: "Created By",
        dataIndex: "createdBy",
        width: "200px",
      },
      {
        title: "Modified",
        dataIndex: "modified",
      },
    ];
    const dataSource = Array.from<DataType>({ length: 46 }).map<DataType>(
      (_, i) => ({
        key: i,
        id: i,
        title: (
          <Link
            href={`/content/${i}`}
          >{`The Legend of Zelda: Chapter ${i}`}</Link>
        ),
        createdBy: "Huy Quang Nguyen",
        modified: new Date().toLocaleString(),
      }),
    );
    return (
      <Flex gap={10} vertical>
        <Title level={2}>Content list</Title>
        <Flex align="center" justify="end" gap={10}>
          <Search placeholder="Search something..." />
          <Button danger>Delete</Button>
        </Flex>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowSelection={{
            type: "checkbox",
          }}
          size="small"
        />
      </Flex>
    );
  },
  { returnTo: "/" },
);

export const runtime = "edge";
