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

    <div
      v-if="!$route.query.access || $route.query.access == 'Полный доступ'"
      class="container new task"
    >
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

    <div v-if="!$route.query.access" class="invitations">
      <div class="new invitation">
        <RouterLink to="/profile/search?mode=invitation" class="button">
          <img src="../assets/img/add.svg" alt="Пригласить" />
          <p class="fio">Пригласить</p>
        </RouterLink>
      </div>

      <div
        v-for="invitation in data.groupInfo.invitations"
        :key="invitation.UUID"
        class="button invitation"
        @click="deleteInvitation(invitation.UUID)"
      >
        <img
          v-if="invitation.invitationUser.userProfile.photoUrl"
          :src="invitation.invitationUser.userProfile.photoUrl"
          alt="Фото профиля"
        />
        <img v-else src="../assets/img/default.svg" alt="Фото профиля" />
        <p class="fio" :title="invitation.invitationAccess.description">
          {{ invitation.invitationUser.userProfile.lastName }}
          {{ invitation.invitationUser.userProfile.firstName }}
          ({{ invitation.invitationAccess.name }})
        </p>
      </div>
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
          <div class="subtasks">
            <select name="" id="" @click="getSubtasks(task.UUID)">
              <option value="" disabled selected>Подзадачи</option>
              <option v-for="subtask in data.subtasks" :key="subtask.UUID">
                {{ subtask.name }}
              </option>
            </select>
            <button
              v-if="
                !$route.query.access || $route.query.access == 'Полный доступ'
              "
              type="button"
              class="button"
              @click="createSubtask(task.UUID)"
            >
              <img src="../assets/img/add.svg" alt="" />
            </button>
          </div>
        </div>
        <div class="info">
          <p>{{ task.description }}</p>
        </div>
        <div class="info">
          <select
            v-if="
              (!$route.query.access ||
                $route.query.access !== 'Только чтение') &&
              +new Date(task.deadlineISO) - data.time > 0
            "
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
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

var newTask = reactive({
  name: "",
  description: "",
  deadlineISO: "",
});

const data = reactive({
  groupInfo: {},
  statuses: [],
  subtasks: [],
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
      .then(async (res) => {
        if (res.status < 300) {
          return res.json();
        } else {
          const message = await res.json();
          throw new Error(message);
        }
      })
      .then((json) => {
        data.groupInfo.group.groupTasks.push(json);
        newTask = reactive({
          name: "",
          description: "",
          deadlineISO: "",
        });
      })
      .catch((err) => {
        alert(err.message);
      });
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
  })
    .then(async (res) => {
      if (res.status < 300) {
        return res.json();
      } else {
        const message = await res.json();
        throw new Error(message);
      }
    })
    .catch((err) => alert(err.message));
}

function deleteInvitation(UUID) {
  if (
    confirm(
      "Вы уверены, что хотите удалить этого пользователя из рабочего пространства?"
    )
  ) {
    fetch(`https://taski-helper.mooo.com/api/invitations/${UUID}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (res.status < 300) {
          return res.json();
        } else {
          const message = await res.json();
          throw new Error(message);
        }
      })
      .then(
        (res) =>
          (data.groupInfo.invitations = data.groupInfo.invitations.filter(
            (item) => item.UUID !== UUID
          ))
      )
      .catch((err) => alert(err.message));
  }
}

function getSubtasks(uuid) {
  fetch(`https://taski-helper.mooo.com/api/subtasks/${uuid}`)
    .then((res) => res.json())
    .then((json) => (data.subtasks = json))
    .catch((err) => alert(err.message));
}

function createSubtask(uuid) {
  const name = prompt("Введите название подзадачи", "Новая подзадача");
  const description = prompt("Введите описание подзадачи", "Описание...");
  if (name && description) {
    fetch(`https://taski-helper.mooo.com/api/subtasks/${uuid}`, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        description: description,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.ok) {
          alert("Подзадача добавлена!");
        } else {
          const message = await res.json();
          console.log(message);

          throw new Error(message);
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }
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

.card > img,
.invitation img {
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

.invitations {
  @include GlassBackground;
  @include Flex-HS;
  padding: 5px;
  justify-content: flex-start;
  min-height: 75px;
}

.invitations > * {
  @include GlassBackground;
  width: 65px;
  min-height: 65px;
  overflow-x: auto;
}

.invitation {
  @include Flex-C;
  padding: 2px;
}

.invitation.button {
  height: 100%;
  padding: 2px;
  &:hover {
    background: $transparent-orange;
  }
}

.fio {
  font-size: x-small;
  text-align: center;
}

.invitation > .button {
  width: 100%;
  height: 100%;
}

.subtasks {
  @include Flex-HS;
}

.subtasks select {
  flex: 1;
}

.subtasks .button {
  width: 30px;
  flex: 0 1 30px;
}
</style>