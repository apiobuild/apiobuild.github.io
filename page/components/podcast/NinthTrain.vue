<template>
  <!-- Decorative: a diorama of the show's namesake train ride, not content of
    its own -- every word on it is already said elsewhere on the page. Sized
    and centred to fill whatever box the hero grid gives it, the same way
    the rest of the hero's art slot is meant to be filled. -->
  <div class="ninth-wrap" aria-hidden="true">
    <div
      ref="stage"
      class="ninth-stage"
      :class="{ 'is-dragging': dragging }"
      @pointerdown="onDragStart"
    >
      <div class="ninth-bezel">
        <div class="ninth-header">
          <div class="ninth-logo">9</div>
          <div class="ninth-wordmark">
            <div class="ninth-name">THE NINTH</div>
            <div class="ninth-tag">PODCAST SERIES</div>
          </div>
        </div>

        <div class="ninth-viewport">
          <div ref="skyRef" class="ninth-sky"></div>

          <div ref="stripRef" class="ninth-strip">
            <!-- Platform one: tile floor, the train's near wall, a bench. -->
            <div style="position:absolute;left:0px;top:0;width:1860px;height:500px;background:#efece5;background-image:repeating-linear-gradient(0deg,rgba(32,38,48,0.10) 0 1px,rgba(0,0,0,0) 1px 22px),repeating-linear-gradient(90deg,rgba(32,38,48,0.10) 0 1px,rgba(0,0,0,0) 1px 22px);"></div>
            <div style="position:absolute;left:0px;top:132px;width:1860px;height:26px;background:#2b3340;"></div>
            <div style="position:absolute;left:0px;top:360px;width:1860px;height:140px;background:#5f636b;"></div>
            <div style="position:absolute;left:0px;top:360px;width:1860px;height:15px;background:#E8B33A;"></div>
            <div style="position:absolute;left:0;top:376px;width:1400px;height:3px;background:rgba(0,0,0,0.22);"></div>
            <div style="position:absolute;left:816px;top:0;width:22px;height:400px;background:#39414e;"></div>

            <div style="position:absolute;left:524px;top:396px;width:148px;height:12px;background:#8a5a33;"></div>
            <div style="position:absolute;left:524px;top:412px;width:148px;height:12px;background:#9a663a;"></div>
            <div style="position:absolute;left:534px;top:424px;width:8px;height:26px;background:#3a4350;"></div>
            <div style="position:absolute;left:654px;top:424px;width:8px;height:26px;background:#3a4350;"></div>
            <div style="position:absolute;left:930px;top:396px;width:148px;height:12px;background:#8a5a33;"></div>
            <div style="position:absolute;left:930px;top:412px;width:148px;height:12px;background:#9a663a;"></div>
            <div style="position:absolute;left:940px;top:424px;width:8px;height:26px;background:#3a4350;"></div>
            <div style="position:absolute;left:1060px;top:424px;width:8px;height:26px;background:#3a4350;"></div>
            <div style="position:absolute;left:744px;top:402px;width:26px;height:48px;background:#2b3340;"></div>
            <div style="position:absolute;left:1190px;top:402px;width:26px;height:48px;background:#2b3340;"></div>
            <div style="position:absolute;left:1432px;top:0;width:22px;height:400px;background:#39414e;"></div>

            <!-- Tunnel mouth into daylight. -->
            <div style="position:absolute;left:1778px;top:0;width:82px;height:500px;background:#060810;"></div>
            <div style="position:absolute;left:0;top:0;width:1400px;height:500px;">
              <div style="position:absolute;left:484px;top:168px;width:300px;background:#0C0F16;box-sizing:border-box;padding:16px 18px;">
                <div style="position:absolute;left:0;top:100%;width:100%;height:9px;background:#2A2F36;transform:skewX(45deg);transform-origin:top left;"></div>
                <div style="position:absolute;left:100%;top:0;width:9px;height:100%;background:#1A1E24;transform:skewY(45deg);transform-origin:left top;"></div>
                <div style="font-size:12px;font-weight:900;letter-spacing:0.16em;color:#FFC694;">PODCAST SERIES</div>
                <div style="height:2px;background:rgba(253,251,247,0.5);margin:13px 0;"></div>
                <div style="font-size:33px;font-weight:700;letter-spacing:-0.03em;line-height:1.06;color:#FDFBF7;text-wrap:pretty;">Stories of Asian American builders</div>
              </div>
            </div>

            <!-- Between the tunnels: a wall of scattered light, Catfight Coffee's storefront. -->
            <div style="position:absolute;left:1860px;top:0;width:280px;height:500px;background:#060810;"></div>
            <div style="position:absolute;left:1790px;top:46px;width:22px;height:2px;background:rgba(255,255,255,0.10);"></div>
            <div style="position:absolute;left:2049px;top:88px;width:58px;height:3px;background:rgba(232,179,58,0.42);"></div>
            <div style="position:absolute;left:2042px;top:88px;width:22px;height:2px;background:rgba(232,179,58,0.54);"></div>
            <div style="position:absolute;left:2002px;top:132px;width:94px;height:4px;background:rgba(232,179,58,0.54);"></div>
            <div style="position:absolute;left:1979px;top:132px;width:58px;height:2px;background:rgba(255,255,255,0.10);"></div>
            <div style="position:absolute;left:1972px;top:132px;width:22px;height:4px;background:rgba(232,179,58,0.30);"></div>
            <div style="position:absolute;left:1867px;top:168px;width:40px;height:4px;background:rgba(255,255,255,0.22);"></div>
            <div style="position:absolute;left:1802px;top:204px;width:76px;height:2px;background:rgba(232,179,58,0.30);"></div>
            <div style="position:absolute;left:1797px;top:204px;width:40px;height:3px;background:rgba(232,179,58,0.42);"></div>
            <div style="position:absolute;left:2007px;top:238px;width:22px;height:3px;background:rgba(232,179,58,0.42);"></div>
            <div style="position:absolute;left:2056px;top:238px;width:76px;height:4px;background:rgba(255,255,255,0.22);"></div>
            <div style="position:absolute;left:2067px;top:238px;width:40px;height:3px;background:rgba(232,179,58,0.66);"></div>
            <div style="position:absolute;left:1944px;top:272px;width:58px;height:3px;background:rgba(255,255,255,0.16);"></div>
            <div style="position:absolute;left:1897px;top:306px;width:94px;height:4px;background:rgba(232,179,58,0.66);"></div>
            <div style="position:absolute;left:1874px;top:306px;width:58px;height:2px;background:rgba(232,179,58,0.30);"></div>
            <div style="position:absolute;left:2102px;top:344px;width:40px;height:2px;background:rgba(232,179,58,0.30);"></div>
            <div style="position:absolute;left:1827px;top:344px;width:94px;height:3px;background:rgba(255,255,255,0.16);"></div>
            <div style="position:absolute;left:1804px;top:344px;width:58px;height:4px;background:rgba(232,179,58,0.54);"></div>
            <div style="position:absolute;left:2021px;top:380px;width:76px;height:2px;background:rgba(255,255,255,0.10);"></div>
            <div style="position:absolute;left:1902px;top:414px;width:22px;height:3px;background:rgba(232,179,58,0.54);"></div>
            <div style="position:absolute;left:1951px;top:414px;width:76px;height:4px;background:rgba(232,179,58,0.66);"></div>
            <div style="position:absolute;left:1839px;top:452px;width:58px;height:3px;background:rgba(232,179,58,0.66);"></div>
            <div style="position:absolute;left:1832px;top:452px;width:22px;height:2px;background:rgba(255,255,255,0.10);"></div>
            <div style="position:absolute;left:1881px;top:452px;width:76px;height:3px;background:rgba(232,179,58,0.42);"></div>
            <div style="position:absolute;left:2140px;top:0;width:160px;height:500px;background:linear-gradient(90deg,#060810 0%,rgba(6,8,16,0.92) 28%,rgba(6,8,16,0.62) 56%,rgba(6,8,16,0.24) 80%,rgba(6,8,16,0) 100%);"></div>
            <div style="position:absolute;left:2140px;top:206px;width:120px;height:5px;background:linear-gradient(90deg,rgba(232,179,58,0.30) 0%,rgba(232,179,58,0) 100%);"></div>

            <img draggable="false" :src="catfightStorefront" alt="Catfight Coffee storefront" style="-webkit-user-drag:none;user-drag:none;pointer-events:none;position:absolute;left:2825px;top:161.5px;width:330px;display:block;" />

            <div style="position:absolute;left:2306px;top:104px;width:104px;height:396px;background-color:#cbb79c;background-image:repeating-linear-gradient(0deg,#cbb79c 0 13px,rgba(0,0,0,0) 13px 35px),repeating-linear-gradient(90deg,rgba(0,0,0,0) 0 13px,#5d6b7d 13px 31px);"></div>
            <div style="position:absolute;left:2306px;top:104px;width:104px;height:15px;background:#a8977d;"></div>
            <div style="position:absolute;left:2418px;top:46px;width:124px;height:454px;background-color:#b9a68d;background-image:repeating-linear-gradient(0deg,#b9a68d 0 13px,rgba(0,0,0,0) 13px 35px),repeating-linear-gradient(90deg,rgba(0,0,0,0) 0 13px,#4a5568 13px 31px);"></div>
            <div style="position:absolute;left:2418px;top:46px;width:124px;height:17px;background:#93826c;"></div>
            <div style="position:absolute;left:2550px;top:132px;width:92px;height:368px;background-color:#d6c8b0;background-image:repeating-linear-gradient(0deg,#d6c8b0 0 13px,rgba(0,0,0,0) 13px 35px),repeating-linear-gradient(90deg,rgba(0,0,0,0) 0 13px,#5d6b7d 13px 31px);"></div>
            <div style="position:absolute;left:2550px;top:132px;width:92px;height:14px;background:#b5a68c;"></div>

            <!-- The sidewalk, running past Catfight's block and on to the next. -->
            <div style="position:absolute;left:2300px;top:446px;width:2020px;height:41px;background:#DFD6D1;"></div>
            <div style="position:absolute;left:2300px;top:446px;width:2020px;height:3px;background:rgba(43,58,85,0.22);"></div>
            <div style="position:absolute;left:2300px;top:487px;width:2020px;height:6px;background:#B0A6A2;"></div>
            <div style="position:absolute;left:2300px;top:493px;width:2020px;height:7px;background:#908684;"></div>
            <img draggable="false" :src="blockShops" alt="Ice cream, bubble tea, ramen and coffee shops on a block" style="-webkit-user-drag:none;user-drag:none;pointer-events:none;position:absolute;left:3270px;top:161px;width:620px;height:339px;display:block;" />

            <!-- Back underground: the far tunnel wall, lit the same way. -->
            <div style="position:absolute;left:3908px;top:0;width:182px;height:500px;background:linear-gradient(90deg,rgba(6,8,16,0) 0%,rgba(6,8,16,0.34) 34%,rgba(6,8,16,0.72) 66%,rgba(6,8,16,0.94) 86%,#060810 100%);"></div>
            <div style="position:absolute;left:4088px;top:0;width:262px;height:500px;background:#060810;"></div>
            <div style="position:absolute;left:4088px;top:46px;width:20px;height:2px;background:rgba(255,255,255,0.10);"></div>
            <div style="position:absolute;left:4133px;top:88px;width:48px;height:3px;background:rgba(232,179,58,0.42);"></div>
            <div style="position:absolute;left:4234px;top:88px;width:20px;height:2px;background:rgba(232,179,58,0.54);"></div>
            <div style="position:absolute;left:4234px;top:132px;width:76px;height:4px;background:rgba(232,179,58,0.54);"></div>
            <div style="position:absolute;left:4277px;top:132px;width:48px;height:2px;background:rgba(255,255,255,0.10);"></div>
            <div style="position:absolute;left:4164px;top:132px;width:20px;height:4px;background:rgba(232,179,58,0.30);"></div>
            <div style="position:absolute;left:4165px;top:168px;width:34px;height:4px;background:rgba(255,255,255,0.22);"></div>
            <div style="position:absolute;left:4224px;top:204px;width:62px;height:2px;background:rgba(232,179,58,0.30);"></div>
            <div style="position:absolute;left:4095px;top:204px;width:34px;height:3px;background:rgba(232,179,58,0.42);"></div>
            <div style="position:absolute;left:4199px;top:238px;width:20px;height:3px;background:rgba(232,179,58,0.42);"></div>
            <div style="position:absolute;left:4154px;top:238px;width:62px;height:4px;background:rgba(255,255,255,0.22);"></div>
            <div style="position:absolute;left:4269px;top:238px;width:34px;height:3px;background:rgba(232,179,58,0.66);"></div>
            <div style="position:absolute;left:4242px;top:272px;width:48px;height:3px;background:rgba(255,255,255,0.16);"></div>
            <div style="position:absolute;left:4129px;top:306px;width:76px;height:4px;background:rgba(232,179,58,0.66);"></div>
            <div style="position:absolute;left:4172px;top:306px;width:48px;height:2px;background:rgba(232,179,58,0.30);"></div>
            <div style="position:absolute;left:4304px;top:344px;width:34px;height:2px;background:rgba(232,179,58,0.30);"></div>
            <div style="position:absolute;left:4245px;top:344px;width:76px;height:3px;background:rgba(255,255,255,0.16);"></div>
            <div style="position:absolute;left:4102px;top:344px;width:48px;height:4px;background:rgba(232,179,58,0.54);"></div>
            <div style="position:absolute;left:4119px;top:380px;width:62px;height:2px;background:rgba(255,255,255,0.10);"></div>
            <div style="position:absolute;left:4094px;top:414px;width:20px;height:3px;background:rgba(232,179,58,0.54);"></div>
            <div style="position:absolute;left:4249px;top:414px;width:62px;height:4px;background:rgba(232,179,58,0.66);"></div>
            <div style="position:absolute;left:4137px;top:452px;width:48px;height:3px;background:rgba(232,179,58,0.66);"></div>
            <div style="position:absolute;left:4266px;top:452px;width:20px;height:2px;background:rgba(255,255,255,0.10);"></div>
            <div style="position:absolute;left:4179px;top:452px;width:62px;height:3px;background:rgba(232,179,58,0.42);"></div>

            <!-- Platform two: the terminus, everyone waiting together. -->
            <div style="position:absolute;left:4350px;top:0;width:2280px;height:500px;background:#efece5;background-image:repeating-linear-gradient(0deg,rgba(32,38,48,0.10) 0 1px,rgba(0,0,0,0) 1px 22px),repeating-linear-gradient(90deg,rgba(32,38,48,0.10) 0 1px,rgba(0,0,0,0) 1px 22px);"></div>
            <div style="position:absolute;left:4350px;top:132px;width:2280px;height:26px;background:#2b3340;"></div>
            <div style="position:absolute;left:4350px;top:360px;width:2280px;height:140px;background:#5f636b;"></div>
            <div style="position:absolute;left:4350px;top:360px;width:2280px;height:15px;background:#E8B33A;"></div>
            <div style="position:absolute;left:4350px;top:375px;width:2280px;height:3px;background:rgba(0,0,0,0.22);"></div>
            <div style="position:absolute;left:4762px;top:0;width:22px;height:400px;background:#39414e;"></div>
            <div style="position:absolute;left:5070px;top:0;width:22px;height:400px;background:#39414e;"></div>
            <div style="position:absolute;left:5446px;top:0;width:22px;height:400px;background:#39414e;"></div>

            <div style="position:absolute;left:5154px;top:396px;width:148px;height:12px;background:#8a5a33;"></div>
            <div style="position:absolute;left:5154px;top:412px;width:148px;height:12px;background:#9a663a;"></div>
            <div style="position:absolute;left:5164px;top:424px;width:8px;height:26px;background:#3a4350;"></div>
            <div style="position:absolute;left:5284px;top:424px;width:8px;height:26px;background:#3a4350;"></div>
            <div style="position:absolute;left:5374px;top:402px;width:26px;height:48px;background:#2b3340;"></div>

            <div style="position:absolute;left:0;top:0;width:6630px;height:500px;">
              <img draggable="false" :src="ashly" alt="" style="-webkit-user-drag:none;user-drag:none;pointer-events:none;position:absolute;left:4724px;top:275px;width:77px;height:180px;display:block;" />
              <img draggable="false" :src="catfight1" alt="" style="-webkit-user-drag:none;user-drag:none;pointer-events:none;position:absolute;left:4806px;top:360px;width:75px;height:95px;display:block;" />
              <img draggable="false" :src="meiling" alt="" style="-webkit-user-drag:none;user-drag:none;pointer-events:none;position:absolute;left:4864px;top:275px;width:76px;height:180px;display:block;" />
              <!-- Lulu, between the dog and cat -- earlier in source order than
                either so both stack in front of her rather than her covering them. -->
              <img draggable="false" :src="lulu" alt="" style="-webkit-user-drag:none;user-drag:none;pointer-events:none;position:absolute;left:4988px;top:275px;width:110px;height:180px;display:block;" />
              <img draggable="false" :src="luna" alt="" style="-webkit-user-drag:none;user-drag:none;pointer-events:none;position:absolute;left:4932px;top:349px;width:80px;height:104px;display:block;" />
              <img draggable="false" :src="catfight2" alt="" style="-webkit-user-drag:none;user-drag:none;pointer-events:none;position:absolute;left:5070px;top:357px;width:74px;height:96px;display:block;" />
              <div style="position:absolute;left:4882px;top:235px;width:28px;height:20px;background:#D99A53;animation:ninth-bubble-bob 2.6s ease-in-out 0s infinite;">
                <div style="position:absolute;left:0;top:100%;width:100%;height:4px;background:#B87C38;transform:skewX(45deg);transform-origin:top left;"></div>
                <div style="position:absolute;left:100%;top:0;width:4px;height:100%;background:#996326;transform:skewY(45deg);transform-origin:left top;"></div>
                <div style="position:absolute;left:5px;top:100%;width:13px;height:9px;background:#B87C38;clip-path:polygon(69.2% 0,100% 0,54.3% 100%,23.5% 100%);"></div>
                <div style="position:absolute;left:5px;top:100%;width:9px;height:9px;background:#D99A53;clip-path:polygon(0 0,100% 0,34% 100%);"></div>
              </div>
              <div style="position:absolute;left:4962px;top:307px;width:28px;height:20px;background:#D57E51;animation:ninth-bubble-bob 2.2s ease-in-out 0.5s infinite;">
                <div style="position:absolute;left:0;top:100%;width:100%;height:4px;background:#B45F34;transform:skewX(45deg);transform-origin:top left;"></div>
                <div style="position:absolute;left:100%;top:0;width:4px;height:100%;background:#9F4628;transform:skewY(45deg);transform-origin:left top;"></div>
                <div style="position:absolute;left:5px;top:100%;width:13px;height:9px;background:#B45F34;clip-path:polygon(69.2% 0,100% 0,54.3% 100%,23.5% 100%);"></div>
                <div style="position:absolute;left:5px;top:100%;width:9px;height:9px;background:#D57E51;clip-path:polygon(0 0,100% 0,34% 100%);"></div>
              </div>
              <div style="position:absolute;left:5098px;top:320px;width:28px;height:20px;background:#505052;animation:ninth-bubble-bob 2.9s ease-in-out 1.1s infinite;">
                <div style="position:absolute;left:0;top:100%;width:100%;height:4px;background:#3A3A3C;transform:skewX(45deg);transform-origin:top left;"></div>
                <div style="position:absolute;left:100%;top:0;width:4px;height:100%;background:#262628;transform:skewY(45deg);transform-origin:left top;"></div>
                <div style="position:absolute;left:5px;top:100%;width:13px;height:9px;background:#3A3A3C;clip-path:polygon(69.2% 0,100% 0,54.3% 100%,23.5% 100%);"></div>
                <div style="position:absolute;left:5px;top:100%;width:9px;height:9px;background:#505052;clip-path:polygon(0 0,100% 0,34% 100%);"></div>
              </div>
            </div>
            <div style="position:absolute;left:5774px;top:396px;width:148px;height:12px;background:#8a5a33;"></div>
            <div style="position:absolute;left:5774px;top:412px;width:148px;height:12px;background:#9a663a;"></div>
            <div style="position:absolute;left:5784px;top:424px;width:8px;height:26px;background:#3a4350;"></div>
            <div style="position:absolute;left:5904px;top:424px;width:8px;height:26px;background:#3a4350;"></div>
            <div style="position:absolute;left:5994px;top:402px;width:26px;height:48px;background:#2b3340;"></div>
            <div style="position:absolute;left:6066px;top:0;width:22px;height:400px;background:#39414e;"></div>

            <!-- The show's two builders, called out where their own storefronts pass.
              Back to the original cream card and this one's own orange -- just
              a bigger mark and bigger, bolder text than the 34px/11px original,
              both of which read as too small to make out at the size these get
              scaled to. -->
            <div style="position:absolute;left:2990px;top:28px;transform:translateX(-50%);display:flex;align-items:center;gap:12px;width:246px;height:70px;box-sizing:border-box;background:#EDE9E0;padding:9px 14px;z-index:6;">
              <div style="position:absolute;left:0;top:100%;width:100%;height:9px;background:#ded7c8;transform:skewX(45deg);transform-origin:top left;"></div>
              <div style="position:absolute;left:100%;top:0;width:9px;height:100%;background:#c4bcab;transform:skewY(45deg);transform-origin:left top;"></div>
              <img draggable="false" :src="catfightMark" alt="Catfight Coffee" style="width:42px;height:44px;object-fit:contain;display:block;flex-shrink:0;" />
              <div style="font-size:15px;font-weight:800;color:#141414;letter-spacing:0.09em;line-height:1.35;">PRESENTED BY<br />CATFIGHT COFFEE</div>
            </div>

            <div style="position:absolute;left:3580px;top:28px;transform:translateX(-50%);display:flex;align-items:center;gap:12px;width:246px;height:70px;box-sizing:border-box;background:#EDE9E0;padding:9px 14px;z-index:6;">
              <div style="position:absolute;left:0;top:100%;width:100%;height:9px;background:#ded7c8;transform:skewX(45deg);transform-origin:top left;"></div>
              <div style="position:absolute;left:100%;top:0;width:9px;height:100%;background:#c4bcab;transform:skewY(45deg);transform-origin:left top;"></div>
              <img draggable="false" :src="bagelMark" alt="Bagel²" style="width:42px;height:44px;object-fit:contain;display:block;flex-shrink:0;" />
              <div style="font-size:15px;font-weight:800;color:#141414;letter-spacing:0.09em;line-height:1.35;">PRESENTED BY<br />BAGEL²</div>
            </div>

            <!-- Darker than the cream cards' orange, with white text -- black
              on the lighter #E07446 measures fine by contrast ratio alone, but
              a saturated mid-orange behind small letter-spaced text still reads
              as muddy. White on this deeper shade is unambiguous. -->
            <div style="position:absolute;left:4950px;top:28px;transform:translateX(-50%);display:flex;align-items:center;gap:12px;width:184px;height:70px;box-sizing:border-box;background:#C4470F;padding:9px 14px;z-index:6;">
              <div style="position:absolute;left:0;top:100%;width:100%;height:9px;background:#99380C;transform:skewX(45deg);transform-origin:top left;"></div>
              <div style="position:absolute;left:100%;top:0;width:9px;height:100%;background:#7C2D0A;transform:skewY(45deg);transform-origin:left top;"></div>
              <div style="position:absolute;left:26px;top:100%;width:35px;height:22px;background:#99380C;clip-path:polygon(74.3% 0,100% 0,51% 100%,25.3% 100%);"></div>
              <div style="position:absolute;left:26px;top:100%;width:26px;height:22px;background:#C4470F;clip-path:polygon(0 0,100% 0,34% 100%);"></div>
              <div style="font-size:15px;font-weight:900;color:#fff;letter-spacing:0.09em;line-height:1.35;">JOIN THE<br />CONVERSATION</div>
            </div>
          </div>

          <div ref="lightRef" class="ninth-light"></div>
        </div>
      </div>
    </div>

    <!-- Nothing about the scene says it can be dragged, so say it -- until
      someone does. Same trigger and fade as the cube's hint. -->
    <div class="ninth-hint" :class="{ 'is-shown': ready && !handled }">
      <svg class="ninth-hand" viewBox="0 0 40 40">
        <defs>
          <g id="ninth-hand-shape">
            <rect x="11" y="4" width="8" height="20" rx="4" />
            <rect x="11" y="16" width="20" height="19" rx="8" />
            <rect x="18.5" y="15" width="6" height="9" rx="3" />
            <rect x="24" y="17" width="6" height="9" rx="3" />
          </g>
        </defs>
        <use class="ninth-hand-outline" href="#ninth-hand-shape" />
        <use class="ninth-hand-fill" href="#ninth-hand-shape" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import catfightStorefront from "~/assets/ninth-hero/catfight-storefront.webp";
import blockShops from "~/assets/ninth-hero/block-shops.webp";
import ashly from "~/assets/ninth-hero/ashly.webp";
import catfight1 from "~/assets/ninth-hero/catfight1.webp";
import meiling from "~/assets/ninth-hero/meiling.webp";
import luna from "~/assets/ninth-hero/luna.webp";
import catfight2 from "~/assets/ninth-hero/catfight2.webp";
import lulu from "~/assets/ninth-hero/lulu.png";
// Bagel²'s mark, already on the page in podcast.json's host links -- reused
// here rather than kept as a second copy of the same logo. Catfight's own
// mark is orange, which now doubles as this scene's whole accent color, so
// a monochrome (thresholded black/white) pass of it stands in here instead
// of competing with everything else on the ride that's already orange.
import bagelMark from "~/assets/brand/bagel-mark.png";
import catfightMark from "~/assets/ninth-hero/catfight-mark-mono.png";

// The ride, as a timeline of world-space x positions (px, at the scene's
// native 1x). A "move" eases between two points; a "hold" parks the strip
// so a stop's copy can be read. Durations are seconds.
const PHASES = [
  { kind: "move", a: 0, b: 460, dur: 0.2 },
  { kind: "hold", x: 460, dur: 2.0 },
  { kind: "move", a: 460, b: 2760, dur: 1.5 },
  { kind: "hold", x: 2760, dur: 2.0 },
  { kind: "move", a: 2760, b: 3350, dur: 1.0 },
  { kind: "hold", x: 3350, dur: 2.0 },
  { kind: "move", a: 3350, b: 4720, dur: 1.0 },
  { kind: "hold", x: 4720, dur: 2.0 },
  { kind: "move", a: 4720, b: 6170, dur: 0.2 }
];
const TOTAL = PHASES.reduce((sum, p) => sum + p.dur, 0);
const WORLD_END = (() => {
  const last = PHASES[PHASES.length - 1];
  return last.kind === "move" ? last.b : last.x;
})();
// Where the strip parks under reduced motion: the first hold, so there is
// still a scene to look at without anything moving on its own.
const RESTING_X = PHASES.find((p) => p.kind === "hold").x;

// The clock time each hold phase begins at -- where a released drag snaps
// to, so letting go always lands on a scene rather than mid-transit.
const STOPS = (() => {
  let acc = 0;
  const stops = [];
  for (const p of PHASES) {
    if (p.kind === "hold") stops.push({ x: p.x, clock: acc });
    acc += p.dur;
  }
  return stops;
})();

const stage = ref(null);
const skyRef = ref(null);
const stripRef = ref(null);
const lightRef = ref(null);
// The hint shows once the scene has drawn, and goes for good once it is handled.
const ready = ref(false);
const handled = ref(false);
const dragging = ref(false);

let clock = 0;
let lastX = 0;
let frame = 0;
let visible = true;
let dragState = null;
// Aborts the current drag's document listeners -- set in onDragStart,
// cleared on release, and also aborted on unmount (see onBeforeUnmount).
let dragAbort = null;
// A release tweens the clock from where the drag left it to a stop's, so
// letting go always snaps onto a scene instead of leaving the ride parked
// mid-transit.
let settle = null;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const SETTLE_MS = 420;
// Screen px, past scale: below this a release is a tap, not a swipe, and
// stays on the stop it started at rather than reading a direction out of
// pointer jitter.
const SWIPE_PX = 16;

// The stop a given clock time belongs to: the last one at or before it, so
// mid-transit counts as still belonging to the stop just departed. Stops
// are widely and unevenly spaced (460 to 4720 apart) -- nearest-by-distance
// would pick the departure stop back for almost any swipe short of one that
// drags more than halfway to the next one, which reads as "swiping does
// nothing." Index-stepping instead means ANY swipe past SWIPE_PX moves
// exactly one stop, in the direction swiped, like a carousel.
function stopIndexAt(c) {
  let idx = 0;
  for (let i = 0; i < STOPS.length; i++) {
    if (STOPS[i].clock <= c) idx = i;
    else break;
  }
  return idx;
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Fast off the platform, long brake into the stop -- a subway pulling away
// and coasting in, not a linear pan.
function ease(t) {
  if (t < 0.18) return Math.pow(t / 0.18, 1.4) * 0.3;
  return 0.3 + 0.7 * (1 - Math.pow(1 - (t - 0.18) / 0.82, 3.0));
}

function sample(c) {
  // Cyclic: a settle tween crossing the loop seam interpolates a raw clock
  // outside [0, TOTAL) on purpose (see onDragStart), so this has to keep
  // making sense out there rather than clamping to an endpoint.
  c = ((c % TOTAL) + TOTAL) % TOTAL;
  let acc = 0;
  for (const p of PHASES) {
    if (c < acc + p.dur || p === PHASES[PHASES.length - 1]) {
      const local = Math.min(1, (c - acc) / p.dur);
      return p.kind === "hold" ? p.x : p.a + (p.b - p.a) * ease(local);
    }
    acc += p.dur;
  }
  return 0;
}

// One tunnel mouth on this ride, at world x 2300: light builds slowly
// approaching it in the dark and settles slowly once outside.
function bloomAt(x) {
  const peak = 2300 - 230;
  if (x < peak - 90 || x > peak + 350) return 0;
  return x <= peak
    ? Math.pow((x - (peak - 90)) / 90, 2)
    : Math.pow(Math.max(0, 1 - (x - peak) / 350), 2);
}

// Binary search: sample() is monotonic within a lap, so this inverts it to
// find the clock time a dragged world position corresponds to.
function xToClock(target) {
  let lo = 0;
  let hi = TOTAL;
  for (let i = 0; i < 26; i++) {
    const mid = (lo + hi) / 2;
    if (sample(mid) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function apply() {
  const x = reducedMotion() && !dragState ? RESTING_X : sample(clock);
  lastX = x;
  if (stripRef.value) stripRef.value.style.transform = "translateX(" + -x + "px)";
  if (skyRef.value) skyRef.value.style.transform = "translateX(" + -x * 0.22 + "px)";
  if (lightRef.value) lightRef.value.style.opacity = bloomAt(x);
}

let lastTick = 0;
function tick(now) {
  const dt = Math.min(0.05, (now - (lastTick || now)) / 1000);
  lastTick = now;
  if (settle) {
    const t = Math.min(1, (now - settle.start) / settle.dur);
    clock = settle.from + (settle.to - settle.from) * easeOutCubic(t);
    if (t >= 1) {
      // Fold back into [0, TOTAL) -- settle.to can be outside that range
      // when the release crossed the loop seam (see onDragStart).
      clock = ((settle.to % TOTAL) + TOTAL) % TOTAL;
      settle = null;
    }
  } else if (!dragState && !reducedMotion()) {
    clock = (clock + dt) % TOTAL;
  }
  apply();
  frame = visible ? requestAnimationFrame(tick) : 0;
  if (!frame) lastTick = 0;
}

function kick() {
  if (!frame && visible) frame = requestAnimationFrame(tick);
}

function onDragStart(event) {
  if (event.button !== undefined && event.button !== 0) return;
  const host = event.currentTarget;
  handled.value = true;
  dragging.value = true;
  if (settle) {
    // A fresh grab interrupts any settle in flight. clock can be sitting
    // outside [0, TOTAL) mid-tween (see onDragStart's wrap comment below) --
    // fold it back so stopIndexAt, which assumes that range, reads it right.
    clock = ((clock % TOTAL) + TOTAL) % TOTAL;
    settle = null;
  }
  // startX/startWorld anchor the release's direction check; world/from track
  // the live scrub and get reassigned as the pointer moves.
  dragState = { startX: event.clientX, startIdx: stopIndexAt(clock), from: event.clientX, world: sample(clock) };
  try {
    host.setPointerCapture(event.pointerId);
  } catch {
    // Capture is a nicety; without it a drag still works on the scene.
  }

  const move = (ev) => {
    if (!dragState) return;
    let target = dragState.world - (ev.clientX - dragState.from) / scale;
    target = ((target % WORLD_END) + WORLD_END) % WORLD_END;
    clock = xToClock(target);
    apply();
  };
  const up = (ev) => {
    if (!dragState) return;
    // Direction from the drag's start, not nearest-by-distance from wherever
    // scrubbing left the clock: stops are widely and unevenly spaced, so
    // "nearest" is almost always the stop the drag departed from. Screen
    // pixels, not world ones -- a swipe is a gesture size, not tied to scale.
    const netPx = (ev?.clientX ?? dragState.from) - dragState.startX;
    let idx = dragState.startIdx;
    if (Math.abs(netPx) > SWIPE_PX) idx += netPx < 0 ? 1 : -1;
    // Stepping past either end is the same loop the ride's own autoplay
    // takes -- keep the target clock on that side of TOTAL (not wrapped
    // into [0, TOTAL) yet) so the settle tween below interpolates straight
    // through the seam instead of rewinding back across every other stop
    // to reach index 0 from the last one, or fast-forwarding through all of
    // them to reach the last one from index 0.
    let targetClock;
    if (idx >= STOPS.length) targetClock = STOPS[0].clock + TOTAL;
    else if (idx < 0) targetClock = STOPS[STOPS.length - 1].clock - TOTAL;
    else targetClock = STOPS[idx].clock;

    dragState = null;
    dragging.value = false;
    const now = performance.now();
    settle = reducedMotion()
      ? null
      : { from: clock, to: targetClock, start: now, dur: SETTLE_MS };
    // Reduced motion: land on the stop at once, already folded in range.
    if (!settle) clock = ((targetClock % TOTAL) + TOTAL) % TOTAL;
    dragAbort?.abort();
    dragAbort = null;
  };
  // An AbortController rather than three matched removeEventListener calls,
  // so a component unmount mid-drag (an SPA nav away while touching) can
  // close these out too via the same signal instead of leaving them on
  // document forever -- see onBeforeUnmount.
  dragAbort = new AbortController();
  const { signal } = dragAbort;
  document.addEventListener("pointermove", move, { signal });
  document.addEventListener("pointerup", up, { signal });
  document.addEventListener("pointercancel", up, { signal });
}

let resizeObserver;
let intersectionObserver;
// The scene renders at this many CSS pixels per native (488-wide) pixel --
// on a phone that's well under 1. onDragStart's move handler divides by it
// so a finger moving N screen pixels always drags N *native* pixels of
// scenery, not N pixels of whatever the scene happens to be scaled to.
let scale = 1;

onMounted(() => {
  const el = stage.value;
  ready.value = true;
  apply();
  kick();

  // Scales the whole 488x620 scene to whatever box the hero grid gives it --
  // "contain", not stretch, so nothing in the diorama distorts.
  const frame = el.querySelector(".ninth-bezel");
  const fit = () => {
    scale = Math.min(el.clientWidth / 488, el.clientHeight / 620) || 1;
    frame.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
  };
  resizeObserver = new ResizeObserver(fit);
  resizeObserver.observe(el);
  fit();

  // Stops while scrolled away, and picks up again on the way back.
  intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) kick();
  });
  intersectionObserver.observe(el);
});

onBeforeUnmount(() => {
  visible = false;
  cancelAnimationFrame(frame);
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  dragAbort?.abort();
});
</script>

<script>
export default {
  name: "PodcastNinthTrain"
};
</script>

<style scoped>
/* The scene over its hint, both sized and centred to fill the hero's art
   grid area. */
.ninth-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

.ninth-stage {
  position: relative;
  flex: 0 1 auto;
  min-height: 0;
  width: 100%;
  aspect-ratio: 488 / 620;
  overflow: hidden;
  /* Not pan-y: letting the browser treat an off-axis touch as page scroll
     was cancelling the pointer sequence mid-swipe (no pointerup, ever), so
     a drag would silently stop responding. A drag here is the whole point
     of the box, so it claims every touch instead of guessing which axis. */
  touch-action: none;
  user-select: none;
  cursor: grab;
}

.ninth-stage.is-dragging {
  cursor: grabbing;
}

/* Native size always; JS scales this to fit whatever box .ninth-stage ends
   up with, so every absolutely-positioned pixel inside stays in step. */
.ninth-bezel {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 488px;
  height: 620px;
  transform: translate(-50%, -50%);
  transform-origin: center;
  border: 14px solid #cfcfc9;
  border-radius: 36px;
  box-sizing: border-box;
  background: #0e0e12;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.16), inset 0 0 0 7px #1d2027, inset 0 0 0 9px #8f8f8a;
  overflow: hidden;
}

.ninth-header {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 92px;
  background: #101014;
  box-sizing: border-box;
  padding: 0 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 10;
}

.ninth-logo {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ff6319;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 39px;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}

.ninth-wordmark {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ninth-name {
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.01em;
  line-height: 1;
}

.ninth-tag {
  font-size: 12px;
  font-weight: 900;
  /* Lighter than the logo's own orange, and bolder -- that shade as small
     letter-spaced text on the header's near-black reads low-contrast even
     lightened alone. Still flagged as hard to read at 11px/800 -- bigger,
     heavier and lighter still. */
  color: #ffc694;
  letter-spacing: 0.18em;
  line-height: 1;
}

.ninth-viewport {
  position: absolute;
  left: 0;
  right: 0;
  top: 93px;
  bottom: 0;
  overflow: hidden;
}

.ninth-sky {
  position: absolute;
  left: 0;
  top: 0;
  width: 5500px;
  height: 500px;
  background: linear-gradient(#4c9ad9 0%, #9acce9 58%, #dbe9f2 100%);
  will-change: transform;
}

.ninth-strip {
  position: absolute;
  left: 0;
  top: 0;
  width: 6630px;
  height: 500px;
  will-change: transform;
}

.ninth-light {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 96% 48%,
    rgba(255, 255, 255, 0.82) 0%,
    rgba(255, 255, 255, 0.46) 20%,
    rgba(255, 255, 255, 0.16) 44%,
    rgba(255, 255, 255, 0.03) 70%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 0;
  z-index: 8;
}

@keyframes ninth-bubble-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.ninth-hint {
  display: flex;
  justify-content: center;
  margin-top: 0.6rem;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.ninth-hint.is-shown {
  opacity: 1;
}

.ninth-hand {
  width: 1.9rem;
  height: 1.9rem;
  overflow: visible;
  animation: ninth-hand-swipe 2s cubic-bezier(0.45, 0, 0.3, 1) infinite;
}

.ninth-hand-outline {
  fill: var(--pod-text);
  stroke: var(--pod-text);
  stroke-width: 4.5;
  stroke-linejoin: round;
}

.ninth-hand-fill {
  fill: var(--pod-lime);
}

@keyframes ninth-hand-swipe {
  0% {
    opacity: 0;
    transform: translateX(-18px) rotate(-14deg) scale(1);
  }
  15% {
    opacity: 1;
    transform: translateX(-18px) rotate(-14deg) scale(0.88);
  }
  55% {
    opacity: 1;
    transform: translateX(18px) rotate(12deg) scale(0.88);
  }
  75%,
  100% {
    opacity: 0;
    transform: translateX(20px) rotate(12deg) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ninth-hand {
    animation: none;
  }
}
</style>
