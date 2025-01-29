import { createRouter, createWebHistory } from "vue-router";
import MoviesList from "@/components/MoviesList.vue";
import MovieDetail from "@/components/MovieDetail.vue";
import BookingForm from "@/components/BookingForm.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: MoviesList,
  },
  {
    path: "/movie/:id",
    name: "MovieDetail",
    component: MovieDetail,
    props: true,
  },
  {
    path: "/book/:id",
    name: "BookingForm",
    component: BookingForm,
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
