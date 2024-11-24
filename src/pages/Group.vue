<template>
  <div class="content">
    <HeaderPanel></HeaderPanel>
    <div class="container">
      <h2>
        Рабочее пространство "{{ data.groupInfo.group.name }}"
        <span v-if="$route.query.access">({{ $route.query.access }})</span>
      </h2>
      <p class="description">{{ data.groupInfo.group.description }}</p>
    </div>

    <div class="container new task">
      <h3>Новая задача</h3>
      <div>
        <input
          type="text"
          placeholder="Краткое название задачи"
          v-model="newTask.name"
        />
        <input
          type="datetime-local"
          placeholder="Дата сдачи"
          @input="
            (event) =>
              (newTask.deadlineISO = new Date(event.target.value).toISOString())
          "
        />
      </div>
      <textarea
        placeholder="Описание задачи"
        v-model="newTask.description"
      ></textarea>
      <button type="button" class="button" @click="createTask">Создать</button>
    </div>

    <div class="container list">
      <h3 v-if="!data.groupInfo.group.groupTasks.length">
        Кажется, тут еще нет никаких задач...
      </h3>
      <div
        v-else
        v-for="task in data.groupInfo.group.groupTasks"
        :key="task.UUID"
        class="task card"
      >
        <img
          v-if="task.taskAuthor.userProfile.photoUrl"
          :src="task.taskAuthor.userProfile.photoUrl"
          alt="Фото профиля"
        />
        <img v-else src="../assets/img/default.svg" alt="Фото профиля" />
        <div class="info">
          <p>
            {{ task.name }} (автор: {{ task.taskAuthor.userProfile.lastName }}
            {{ task.taskAuthor.userProfile.firstName }})
          </p>
          <p class="time">
            Истекает через:
            {{
              Math.max(
                0,
                Math.floor(
                  (+new Date(task.deadlineISO) - data.time) /
                    (1000 * 60 * 60 * 24)
                )
              )
            }}дн.
            {{
              Math.max(
                0,
                Math.floor(
                  ((+new Date(task.deadlineISO) - data.time) /
                    (1000 * 60 * 60)) %
                    24
                )
              )
            }}ч.
            {{
              Math.max(
                0,
                Math.floor(
                  ((+new Date(task.deadlineISO) - data.time) / (1000 * 60)) % 60
                )
              )
            }}мин.
            {{
              Math.max(
                0,
                Math.floor(
                  ((+new Date(task.deadlineISO) - data.time) / 1000) % 60
                )
              )
            }}сек.
          </p>
        </div>
        <div class="info">
          <p>{{ task.description }}</p>
        </div>
        <div class="info">
          <select
            v-if="+new Date(task.deadlineISO) - data.time > 0"
            v-model="task.statusUUID"
            @change="changeTaskStatus(task)"
          >
            <option
              v-for="status in data.statuses"
              :key="status.UUID"
              :value="status.UUID"
            >
              {{ status.name }}
            </option>
          </select>
          <p v-else>{{ task.taskStatus.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { computed, reactive, onMounted } from "vue";
import HeaderPanel from "../components/HeaderPanel.vue";
import { useRoute } from "vue-router";

const route = useRoute();

var newTask = reactive({
  name: "",
  description: "",
  deadlineISO: "",
});

const data = reactive({
  groupInfo: {},
  statuses: [],
  time: new Date(),
});

setInterval(() => {
  data.time = new Date();
}, 1000);

onMounted(() => {
  fetch(`https://taski-helper.mooo.com/api/groups/${route.params.uuid}`)
    .then((res) => res.json())
    .then((json) => (data.groupInfo = json))
    .catch((err) => alert(err.message));

  fetch(`https://taski-helper.mooo.com/api/vars/statuses`)
    .then((res) => res.json())
    .then((json) => (data.statuses = json))
    .catch((err) => alert(err.message));
});

function createTask() {
  if (
    newTask.name.length &&
    newTask.description.length &&
    newTask.deadlineISO.length
  ) {
    fetch("https://taski-helper.mooo.com/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        ...newTask,
        groupUUID: data.groupInfo.group.UUID,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        data.groupInfo.group.groupTasks.push(json);
        newTask = reactive({
          name: "",
          description: "",
          deadlineISO: "",
        });
      })
      .catch((err) => alert(err.message));
  }
}

function changeTaskStatus(task) {
  fetch(`https://taski-helper.mooo.com/api/tasks/${task.UUID}`, {
    method: "PUT",
    body: JSON.stringify({
      statusUUID: task.statusUUID,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => alert(err.message));
}
</script>
  
<style lang="scss" scoped>
@use "../assets/scss/vars" as *;
@use "../assets/scss/mixins" as *;

.content {
  @include Flex-VS;
}

h2 {
  text-align: center;
}

.container {
  @include GlassBackground;
  padding: 5px;
}

.description {
  @include NormalText;
  text-align: left;
}

.task {
  @include Flex-HS;
}

.new.task {
  @include Flex-VS;
}

h3 {
  text-align: center;
}

.new.task > div {
  @include Flex-HC;
  flex-wrap: wrap;
}

input,
textarea,
select {
  padding: 5px;
  min-height: 30px;
  font-size: 16px;
  background: $light;
  border-radius: 5px;
}

input {
  flex: 1 1 200px;
  @include Flex-C;
  text-align: center;
}

textarea {
  width: 100%;
  resize: vertical;
}

.button {
  @include NormalText;
  @include GlassBackground;
  @include Flex-C;
  height: 30px;
  width: 100%;
  align-self: center;
  @include Button;
}

.list {
  @include Flex-VS;
}

.card {
  @include GlassBackground;
  @include Flex-HC;
  padding: 5px;
  flex-wrap: wrap;
}

.card > img {
  @include GlassBackground;
  width: 50px;
  height: 50px;
}

.card > .info {
  @include Flex-VS;
  flex: 1 1 200px;
}

.time {
  font-weight: 700;
}
</style>