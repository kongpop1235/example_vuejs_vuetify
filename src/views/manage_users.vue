<template>
  <v-data-table
    :headers="headers"
    :items="dataUser"
    sort-by="username"
    class="elevation-1"
    item-key="id"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Manage Users</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New User
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.username"
                      label="Username"
                      outlined
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.fname"
                      label="First Name"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.lname"
                      label="Last Name"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.age"
                      label="Age"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="petName"
                      v-model="editedItem.pet"
                      chips
                      label="Pet"
                      multiple
                      outlined
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item, index }">
      <v-icon small class="mr-2" @click="editItem(item, index)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item, index)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Username",
        align: "start",
        value: "username",
      },
      { text: "Age", value: "age" },
      { text: "First Name", value: "fname" },
      { text: "Last Name", value: "lname" },
      { text: "Pet", value: "pet", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1, //ควบคุมข้อความในกล่องสร้าง(New Item)/แก้ไข(Edit Item)
    editedItem: {
      username: "",
      age: 1,
      fname: "",
      lname: "",
      id: null,
      pet: [],
    },
    defaultItem: {
      username: "",
      age: 1,
      fname: "",
      lname: "",
      id: null,
      pet: [],
    },
    value: [],
    dataUser: [],
    dataPet: [],
    petName: [],
  }),
  methods: {
    editItem(item, index) {
      this.editedIndex = index;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item, index) {
      this.editedIndex = this.dataUser.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await axios
        .put(this.$store.getters.api + "delete/user", {
          accessToken: this.$store.getters.accessToken,
          id: this.editedItem.id,
        })
        .then((res) => {
          if (res.statusText === "OK") {
            this.dataUser.splice(this.editedIndex, 1);
            this.closeDelete();
          }
        });
    },

    close() {
      this.dialog = false;
      this.editedItem = this.defaultItem;
      this.editedIndex = -1;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.editedItem = this.defaultItem;
      this.editedIndex = -1;
    },

    async save() {
      const newFname =
        this.editedItem.fname.charAt(0).toUpperCase() +
        this.editedItem.fname.slice(1);
      const newLname =
        this.editedItem.lname.charAt(0).toUpperCase() +
        this.editedItem.lname.slice(1);
      const findPetId = [];
      for (let x in this.editedItem.pet) {
        findPetId.push(
          this.dataPet.find(({ pname }) => pname === this.editedItem.pet[x]).id
        );
      }
      if (this.editedIndex > -1) {
        await axios
          .post(this.$store.getters.api + "update/user", {
            accessToken: this.$store.getters.accessToken,
            id: this.editedItem.id,
            age: this.editedItem.age,
            fname: newFname,
            lname: newLname,
            pet: findPetId,
            username: this.editedItem.username,
          })
          .then((res) => {
            if (res.statusText === "OK") {
              Object.assign(this.dataUser[this.editedIndex], {
                username: this.editedItem.username,
                age: this.editedItem.age,
                fname: newFname,
                lname: newLname,
                id: res.data.id,
                pet: this.editedItem.pet,
              });
            }
          });
      } else {
        await axios
          .post(this.$store.getters.api + "create/user", {
            accessToken: this.$store.getters.accessToken,
            age: this.editedItem.age,
            fname: newFname,
            lname: newLname,
            pet: findPetId,
            username: this.editedItem.username,
          })
          .then(async (res) => {
            console.log(this.editedItem.pet);
            if (res.statusText === "OK") {
              this.dataUser.push({
                username: this.editedItem.username,
                age: this.editedItem.age,
                fname: newFname,
                lname: newLname,
                id: res.data.id,
                pet: this.editedItem.pet,
              });
            }
          });
      }
      this.close();
    },
  }, //function ที่ถูกเรียกใช้จะมีค่าแตกต่างกันไป
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New User" : "Edit User";
    },
  }, //function ที่ถูกเรียกใช้จะมีค่าเท่ากันทั้งหมดเสมอ
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {},
  async mounted() {
    const resUser = await axios.put(this.$store.getters.api + "users", {
      accessToken: this.$store.getters.accessToken,
    });
    const resPet = await axios.put(this.$store.getters.api + "pets", {
      accessToken: this.$store.getters.accessToken,
    });

    for (let x in resUser.data.Items) {
      const petFind = [];
      for (let y in resUser.data.Items[x].pet) {
        console.log(resPet.data.Items.find(({ id }) => id === resUser.data.Items[x].pet[y]).pname)
        petFind.push(
          resPet.data.Items.find(({ id }) => id === resUser.data.Items[x].pet[y]).pname
        );
      }
      resUser.data.Items[x].pet = petFind;
    }
    this.dataUser = resUser.data.Items;
    this.dataPet = resPet.data.Items;

    // console.log(this.dataPet);
    if (resPet.data) {
      for (let x in resPet.data.Items) {
        this.petName.push(resPet.data.Items[x].pname);
      }
    }
  }, //เรียกใช้ฟังชั่นจาก Methods และ computed
};
</script>