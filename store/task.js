import { OK, UNPROCESSABLE_ENTITY, CREATED } from "../plugins/util";

const state = () => ({
  apiStatus: null,
  taskLists: [],
  taskCards: [],
});

const getters = {};

const mutations = {
  setTaskLists(state, taskLists) {
    state.taskLists = taskLists;
  },
  setTaskCards(state, taskCards) {
    state.taskCards = taskCards;
  },
  setApiStatus(state, status) {
    state.apiStatus = status;
  },
};

const actions = {
  //タスクリスト取得
  async taskListsGet(context) {
    const response = await this.$axios.get("/api/task-list");

    if (response.status === CREATED) {
      const taskList = response.data.taskList || null;
      context.commit("setTaskLists", taskList);
      context.commit("setApiStatus", true);
      return false;
    }
    context.commit("setApiStatus", false);
    context.commit("error/setCode", response.status, {
      root: true,
    });
  },
  //タスクカード取得
  async taskCardsGet(context) {
    const response = await this.$axios.get("/api/task-card/all");
    const taskCards = response.data.taskCard || null;
    console.log(taskCards);
    context.commit("setTaskCards", taskCards);
  },
  //404チェック
  async taskapiStatus(context, data) {
    if (data === OK) {
      context.commit("setApiStatus", true);
      return false;
    }
    context.commit("setApiStatus", false);
    context.commit("error/setCode", data, {
      root: true,
    });
  },

  //タスクリスト新規作成
  async taskListsCreate(context, data) {
    const responseStatus = await this.$axios.post("/api/task-list", data);

    if (responseStatus.status === CREATED) {
      const response = await this.$axios.get("/api/task-list");
      const taskList = response.data.taskList || null;
      context.commit("setTaskLists", taskList);
      context.commit("setApiStatus", true);
      return false;
    }

    context.commit("setApiStatus", false);

    context.commit("error/setCode", responseStatus.status, {
      root: true,
    });
  },

  //タスクカード新規作成
  async taskCardCreate(context, data) {
    const responseStatus = await this.$axios.post("/api/task-card", data);

    if (responseStatus.status === CREATED) {
      const response = await this.$axios.get("/api/task-card/all");
      const taskCards = response.data.taskCards || null;

      context.commit("setTaskCards", taskCards);
      context.commit("setApiStatus", true);
      return false;
    }

    context.commit("setApiStatus", false);

    context.commit("error/setCode", responseStatus.status, {
      root: true,
    });
  },

  //タスクカード更新
  async taskCardUpdate(context, data) {
    const responseStatus = await this.$axios.patch(
      "/api/task-card/" + data.id,
      data
    );

    if (responseStatus.status === CREATED) {
      const response = await this.$axios.get("/api/task-list");
      const taskList = response.data.taskList || null;
      context.commit("setTaskLists", taskList);
      context.commit("setApiStatus", true);
      return false;
    }

    context.commit("setApiStatus", false);

    context.commit("error/setCode", responseStatus.status, {
      root: true,
    });
  },
};

export default {
  //namespacedをtrueにすることでアクション呼び出す際に"モジュール/actions名"の形を第一に引数にできる。
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
