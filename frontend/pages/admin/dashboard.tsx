import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AdminLogoutButton } from "../../components/admin-logout-button";
import { AdminSidebar } from "../../components/admin-sidebar";
import { BotApiClient } from "../../components/axios";
import { Navbar } from "../../components/navbar";
import { QuestionTable } from "../../components/questions-table";
import { useAllQuestions } from "../../hooks/use-all-questions";
import { useAllTenant } from "../../hooks/use-all-tenants";
import { Tenant } from "../../types/tenant";
import { TenantTable } from "../../components/tenant-table";
import { useAllCategories } from "../../hooks/use-all-categories";
import { CategoryTable } from "../../components/category-table";

const AdminDashboard: NextPage = () => {
  const sidebarItems = ["Tenants", "Questions", "Categories"];
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: tenants } = useAllTenant();
  const { data: questions } = useAllQuestions();
  const { data: categories } = useAllCategories();

  return (
    <Box height={"100%"}>
      <Navbar>
        <Text fontSize={"xl"} color={"white"}>
          Admin Console
        </Text>
        <AdminLogoutButton />
      </Navbar>
      <Flex height={"100%"}>
        <AdminSidebar
          sidebarItems={sidebarItems}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
        {activeIndex == 0 && tenants && <TenantTable tenants={tenants} />}
        {activeIndex == 1 && questions && (
          <QuestionTable questions={questions} />
        )}
        {activeIndex == 2 && categories && (
          <CategoryTable categories={categories} />
        )}
      </Flex>
    </Box>
  );
};

export default AdminDashboard;
