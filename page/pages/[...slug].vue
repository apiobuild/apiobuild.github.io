<template>
  <v-container class="pt-0">
    <ContentDoc v-slot="{ doc }">
      <ArticleHeader
        :post="{
          title: doc.title,
          img: doc.img,
          author: doc.author,
          authorLink: doc.authorLink,
          date: doc.date,
          tags: doc.tags
        }"
      />
      <v-card flat class="py-15">
        <ContentRenderer :value="doc" />
      </v-card>
    </ContentDoc>
  </v-container>
</template>
