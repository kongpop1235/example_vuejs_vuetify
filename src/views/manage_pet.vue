<template>
  <v-data-table
    :headers="headers"
    :items="dataPet"
    sort-by="name"
    class="elevation-1"
    item-key="id"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Manage Pets</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New Pet
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.pname"
                      label="Name"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.species"
                      label="Species"
                      outlined
                    ></v-text-field>
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
        text: "Name",
        align: "start",
        value: "pname",
      },
      { text: "Species", value: "species" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1, //ควบคุมข้อความในกล่องสร้าง(New Item)/แก้ไข(Edit Item)
    editedItem: {
      id: "",
      pname: "",
      species: "",
    },
    defaultItem: {
      id: "",
      pname: "",
      species: "",
    },
    value: [],
    dataPet: [],
  }),
  methods: {
    editItem(item, index) {
      this.editedIndex = index;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item, index) {
      this.editedIndex = this.dataPet.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await axios
        .put(this.$store.getters.api + "delete/pet", {
          accessToken: this.$store.getters.accessToken,
          id: this.editedItem.id,
        })
        .then((res) => {
          if (res.statusText === "OK") {
            this.dataPet.splice(this.editedIndex, 1);
            this.closeDelete();
          }
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = this.defaultItem;
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = this.defaultItem;
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        console.log(this.editedItem.id);

        await axios
          .post(this.$store.getters.api + "update/pet", {
            accessToken: this.$store.getters.accessToken,
            id: this.editedItem.id,
            pname: this.editedItem.pname,
            species: this.editedItem.species,
          })
          .then((res) => {
            if (res.statusText === "OK") {
              Object.assign(this.dataPet[this.editedIndex], {
                id: this.editedItem.id,
                pname:
                  this.editedItem.pname.charAt(0).toUpperCase() +
                  this.editedItem.pname.slice(1),
                species:
                  this.editedItem.species.charAt(0).toUpperCase() +
                  this.editedItem.species.slice(1),
              });
            }
          });
      } else {
        await axios
          .post(this.$store.getters.api + "create/pet", {
            accessToken: this.$store.getters.accessToken,
            pname: this.editedItem.pname,
            species: this.editedItem.species,
          })
          .then(async (res) => {
            console.log(res.data);
            if (res.statusText === "OK") {
              this.dataPet.push({
                id: res.data.id,
                pname:
                  this.editedItem.pname.charAt(0).toUpperCase() +
                  this.editedItem.pname.slice(1),
                species:
                  this.editedItem.species.charAt(0).toUpperCase() +
                  this.editedItem.species.slice(1),
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
    const resPet = await axios.put(this.$store.getters.api + "pets", {
      accessToken: this.$store.getters.accessToken,
    });
    this.dataPet = resPet.data.Items;
  }, //เรียกใช้ฟังชั่นจาก Methods และ computed
};
</script>