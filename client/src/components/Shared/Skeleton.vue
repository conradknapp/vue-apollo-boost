<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-card class="mt-3 ml-1 mr-2" hover>
        <v-card-media class="skeleton grey lighten-1" height="40vh">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox>
                <span class="product__skeleton--headline headline"> </span>
                <span class="product__skeleton--description"></span>
                <div>
                  <v-btn x-large icon>
                    <v-icon color="grey lighten-1" x-large>favorite</v-icon>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>
      </v-card>
    </v-flex>
    <v-flex xs12 sm6>
      <v-card class="mt-3 ml-1 mr-2" hover>
        <v-card-media class="skeleton grey lighten-1" height="40vh">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox>
                <span class="product__skeleton--headline headline"> </span>
                <span class="product__skeleton--description"></span>
                <div>
                  <v-btn icon>
                    <v-icon color="grey lighten-1" x-large>favorite</v-icon>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "Skeleton"
};
</script>


<style scoped>
.skeleton {
  position: relative;
  overflow: hidden;
}

.skeleton::after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  animation: sweep 2s infinite;
  background-image: linear-gradient(
    to left,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
}

.product__skeleton--headline {
  background: rgba(57, 57, 57, 0.3);
  color: rgba(57, 57, 57, 0.3);
}

.product__skeleton--description {
  background: rgba(57, 57, 57, 0.3);
  color: rgba(57, 57, 57, 0.3);
  min-height: 4em;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

@keyframes sweep {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(150%);
  }
  100% {
    transform: translate(-100%);
  }
}
</style>