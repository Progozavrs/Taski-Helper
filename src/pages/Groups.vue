<template>
  <div class="content">
    <HeaderPanel></HeaderPanel>
    <div class="my groups">
      <h2 v-if="!$route.query.mode">Мои рабочие пространства</h2>
      <h2 v-if="$route.query.mode">Выберите рабочее пространство</h2>

      <button
        v-if="!$route.query.mode"
        class="button my new group"
        @click="createGroup"
      >
        Создать пространство
      </button>
      <p v-if="!userData.groups[0]?.length">
        Вы еще не создали ни одного своего пространства
      </p>
      <RouterLink
        v-else
        v-for="group in userData.groups[0]"
        :key="group.UUID"
        :to="'/group/' + group.UUID"
        class="button my group"
      >
        <span>{{ group.name }}</span>
        <img
          v-if="!$route.query.mode"
          src="../assets/img/delete.svg"
          alt="Удалить"
          @click.prevent="deleteGroup(group.UUID)"
        />
        <div
          v-if="$route.query.mode == 'invitation'"
          class="invitation"
          @click.prevent="
            inviteUser(
              group.UUID,
              $route.query.userUUID,
              $route.query.accessUUID
            )
          "
        >
          <img src="../assets/img/add.svg" alt="Добавить" />
        </div>
      </RouterLink>
    </div>

    <div v-if="!$route.query.mode" class="other groups">
      <h2>Доверенные рабочие пространства</h2>
      <p v-if="!userData.groups[1]?.length">
        К сожалению, Вам еще не доверили ни одного своего пространства :(
      </p>
      <RouterLink
        v-else
        v-for="group in userData.groups[1]"
        :key="group.invitationGroup.UUID"
        :to="
          '/group/' +
          group.invitationGroup.UUID +
          '?access=' +
          group.invitationAccess.name
        "
        class="button other group"
      >
        {{
          group.invitationGroup.name + " (" + group.invitationAccess.name + ")"
        }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, onMounted } from "vue";
import HeaderPanel from "../components/HeaderPanel.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const userData = reactive({
  groups: [],
  tasks: [],
});

onMounted(() => {
  fetch("https://taski-helper.mooo.com/api/groups")
    .then(async (res) => {
      if (res.status < 300) {
        return res.json();
      } else {
        const message = await res.json();
        throw new Error(message);
      }
    })
    .then((json) => (userData.groups = json))
    .catch((err) => alert(err.message));

  fetch("https://taski-helper.mooo.com/api/tasks/my")
    .then(async (res) => {
      if (res.status < 300) {
        return res.json();
      } else {
        const message = await res.json();
        throw new Error(message);
      }
    })
    .then((json) => (userData.tasks = json))
    .catch((err) => alert(err.message));
});

function createGroup() {
  const name = prompt("Введите название пространства", "Новое простанство");
  const description = prompt("Введите описание пространства", "Описание...");

  if (name && description) {
    fetch("https://taski-helper.mooo.com/api/groups", {
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
        if (res.status < 300) {
          return res.json();
        } else {
          const message = await res.json();
          throw new Error(message);
        }
      })
      .then((json) => userData.groups[0].push(json))
      .catch((err) => alert(err.message));
  }
}

function deleteGroup(UUID) {
  if (confirm("Вы уверены, что хотите удалить это пространство?")) {
    fetch(`https://taski-helper.mooo.com/api/groups/${UUID}`, {
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
          (userData.groups[0] = userData.groups[0].filter(
            (item) => item.UUID !== UUID
          ))
      )
      .catch((err) => alert(err.message));
  }
}

function inviteUser(groupUUID, userUUID, accessUUID) {
  fetch("https://taski-helper.mooo.com/api/invitations", {
    method: "POST",
    body: JSON.stringify({
      groupUUID: groupUUID,
      credentialsUUID: userUUID,
      accessUUID: accessUUID,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      if (res.ok) {
        router.push(`/group/${groupUUID}`);
      } else {
        const message = await res.json();
        throw new Error(message);
      }
    })
    .catch((err) => alert(err.message));
}
</script>
  
<style lang="scss" scoped>
@use "../assets/scss/vars" as *;
@use "../assets/scss/mixins" as *;

.content {
  @include Flex-VS;
}

.button {
  @include NormalText;
  @include GlassBackground;
  @include Flex-C;
  height: 30px;
  width: 100%;
  align-self: center;
  @include Button;
  &.logout {
    background-color: $transparent-orange;
  }
}

.groups {
  @include Flex-VS;
  @include GlassBackground;
  padding: 5px;
}

.my.group {
  padding: 0px 10px;
  @include Flex-HC;
}

.my.group:has(img:hover) {
  background: $transparent-orange;
}

.my.new.group {
  @include Flex-C;
}

.invitation {
  flex: 1;
  @include Flex-C;
  align-items: flex-start;
}

.invitation > img {
  height: 30px;
}
</style>