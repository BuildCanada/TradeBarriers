export const SimpleAnalytics = () => {
  return (
    <>
      <script
        data-collect-dnt="true"
        async
        src="https://scripts.simpleanalyticscdn.com/latest.js"
      ></script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true"
          alt=""
          referrerPolicy="no-referrer-when-downgrade"
        />
      </noscript>{" "}
    </>
  );
};
