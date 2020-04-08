import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '*',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('./views/home'),
    meta: {
      title: 'MQU'
    }
  },
  {
    path: '/multimedia',
    name: 'multimedia',
    component: () => import('./views/multimedia'),
    meta: {
      title: 'multimedia.title'
    }
  },
  {
    path: '/quickUpload',
    name: 'quickUpload',
    component: () => import('./views/quickUpload'),
    meta: {
      title: 'quickUpload.title'
    }
  },
  {
    path: '/votekit',
    name: 'votekit',
    component: () => import('./views/votekit'),
    meta: {
      title: 'votekit.title'
    }
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('./views/error'),
    meta: {
      title: 'error.qrExpired'
    }
  }
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ 
  scrollBehavior: () => ({ y: 0 }),
  routes 
});

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};
