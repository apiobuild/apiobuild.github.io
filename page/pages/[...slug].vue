<template>
  <v-container class="pt-extra">
    <ContentDoc v-slot="{ doc }">
      <ArticleHeader
        :post="{
          title: doc.title,
          description: doc.description,
          img: doc.img,
          author: doc.author,
          authorLink: doc.authorLink,
          date: doc.date,
          tags: doc.tags
        }"
        :url="doc._path"
      />
      <v-card flat class="py-15 markdown-body">
        <ContentRenderer :value="doc" />
        <DisqusComments :title="doc.title" v-if="!doc.disableComment" />
      </v-card>
    </ContentDoc>
  </v-container>
</template>

<style>
.markdown-body {
  p {
    padding-bottom: 30px;
  }
}
.pt-extra {
  padding-top: 100px;
}
</style>
