import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";
import React from "react";

interface DynamicBreadcrumbProps {
  menuData: MenuData[];
}

const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({ menuData }) => {
  const pathname = usePathname();
  // const [breadcrumbItems, setBreadcrumbItems] = useState<string[]>([]);
  const pathSegments = pathname.split("/");

  // console.log({ pathname, breadcrumbItems, setBreadcrumbItems });

  // useEffect(() => {

  //     const findBreadcrumbs = (
  //         menuItems: MenuData[],
  //         segments: string[],
  //         index = 0
  //     ): string[] => {
  //         for (let item of menuItems) {
  //             if (item.url?.includes(segments[index])) {
  //                 if (index === segments.length - 1) {
  //                     return [item.label];
  //                 } else if (item.children) {
  //                     const childBreadcrumbs = findBreadcrumbs(
  //                         item.children,
  //                         segments,
  //                         index + 1
  //                     );
  //                     if (childBreadcrumbs.length > 0) {
  //                         return [item.label, ...childBreadcrumbs];
  //                     }
  //                 }
  //             }
  //         }
  //         return [];
  //     };

  //     const breadcrumbs = findBreadcrumbs(menuData, pathSegments);
  //     setBreadcrumbItems(breadcrumbs);
  // }, [menuData]);

  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      {pathSegments.map((breadcrumb, index) => (
        <Breadcrumb.Item key={index}>
          {breadcrumb.toLocaleUpperCase()}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
