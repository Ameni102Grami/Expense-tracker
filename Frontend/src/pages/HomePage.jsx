import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Badge,
  Button,
} from "@material-tailwind/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user.query";
import { useEffect, useState } from "react";
import { fetchData } from "../utils/axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const { data } = useQuery(GET_TRANSACTION_STATISTICS);
  const [message, setMessage] = useState("");
  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);

  useEffect(() => {
    fetchData(`http://localhost:8080/notifications`).then((response) => {
      setMessage(response?.message);
    });
  }, [message]);

  const [logout, { loading, client }] = useMutation(LOGOUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "$",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  });

  useEffect(() => {
    if (data?.categoryStatistics) {
      const categories = data.categoryStatistics.map((stat) => stat.category);
      const totalAmounts = data.categoryStatistics.map(
        (stat) => stat.totalAmount
      );

      const backgroundColors = [];
      const borderColors = [];

      categories.forEach((category) => {
        if (category === "saving") {
          backgroundColors.push("rgba(75, 192, 192)");
          borderColors.push("rgba(75, 192, 192)");
        } else if (category === "expense") {
          backgroundColors.push("rgba(255, 99, 132)");
          borderColors.push("rgba(255, 99, 132)");
        } else if (category === "investment") {
          backgroundColors.push("rgba(54, 162, 235)");
          borderColors.push("rgba(54, 162, 235)");
        }
      });
      fetchData(`http://localhost:8080/notifications`).then((response) => {
        setMessage(response?.message);
      });

      setChartData((prev) => ({
        labels: categories,
        datasets: [
          {
            ...prev.datasets[0],
            data: totalAmounts,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
          },
        ],
      }));
    }
  }, [data]);

  const handleLogout = async () => {
    try {
      await logout();
      client.resetStore();
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(error.message);
    }
  };
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        <div className="flex items-center">
          <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
            Spend wisely, track wisely
          </p>
          {authUserData?.authUser?.role === "ADMIN" && (
            <button
              onClick={() => navigate("/users")}
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-4"
            >
              Users
            </button>
          )}
          <button
            onClick={() => navigate("/users")}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-4"
          >
            Your Budget :{authUserData?.authUser?.budget}
          </button>
          <Popover>
            <Badge content={message !== "" ? "!" : ""}>
              {" "}
              <PopoverHandler>
                <Button>
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </Button>
              </PopoverHandler>
            </Badge>
            {message !== "" && <PopoverContent>{message}</PopoverContent>}
          </Popover>
          <img
            src={authUserData?.authUser.profilePicture}
            className="w-11 h-11 rounded-full border cursor-pointer"
            alt="Avatar"
          />
          {!loading && (
            <MdLogout
              className="mx-2 w-5 h-5 cursor-pointer"
              style={{ color: "white" }}
              onClick={handleLogout}
            />
          )}

          {loading && (
            <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
          )}
        </div>
        <div className="flex flex-wrap w-full justify-center items-center gap-6">
          {data?.categoryStatistics.length > 0 && (
            <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
              <Doughnut data={chartData} />
            </div>
          )}

          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};
export default HomePage;
