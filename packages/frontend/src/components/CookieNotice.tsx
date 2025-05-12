import BackButton from "./common/BackButton.tsx";

export default function Cookies() {
  return (
    <main className="px-4 flex justify-center">
      <section className="md:w-[800px] w-full">
        <BackButton href="/listings" />
        <h1 className="py-3">
          Cookie Notice
        </h1>
        <section className="mt-2 flex flex-col gap-1 bg-white p-5 rounded-lg">
          <p>
            This Cookie Notice applies to Mass Labs and Mass Market websites
            including their subdomains{" "}
            <em>(“Websites”)</em>. We use cookies to provide a smooth browsing
            experience, enable functionality, understand how the Websites are
            used and track the success of our marketing campaigns. We use the
            privacy-focused web analytics tool, Matomo Analytics, to power our
            tracking and analysis.
          </p>
          <p>
            Below we explain the types of tracking tools we use and why we use
            them. The processing of personal data is described in our Privacy
            Policy.
          </p>
          <p>
            Where we use cookies or similar tools that require your consent, we
            will ask you for consent via a consent banner.
          </p>
          <h2 className="my-3">
            1. Cookies we use
          </h2>
          <h3>
            a. Strictly Necessary or Essential
          </h3>
          <p>
            Strictly necessary cookies are essential for the website to function
            and cannot be declined. We currently do not use any strictly
            necessary or essential cookies.
          </p>

          <h3>b. Analytics - Audience Measurement Tools</h3>
          <p>
            By default, we only use audience measurement tools to measure
            performance, detect navigation problems, optimise technical
            performance and usability of our websites, estimate the necessary
            server capacity and to analyse viewed content, etc. For audience
            measurement, we use Matomo Analytics. We do not use Google. Matomo
            Analytics uses first-party cookies and JavaScript trackers for
            audience measurement purposes to produce anonymous statistical data
            and exclusively on our own behalf. First-party cookies are set by
            the domain you are visiting. They do not track your activity across
            different domains and they are not shared with external domains or
            third parties.
          </p>
          <p>
            Matomo cookies:
          </p>
          <table className="text-[9px] md:text-sm text-center my-5 border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2 w-[130px]">
                  Data recipient
                </th>
                <th className="border border-gray-300 p-2">Purpose</th>
                <th className="border border-gray-300 p-2">
                  Max. storage duration
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">pk-id</td>
                <td className="border border-gray-300 p-2">Mass Labs</td>
                <td className="border border-gray-300 p-2">
                  To store a unique visitor ID.
                </td>
                <td className="border border-gray-300 p-2">13 months</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">-pk-ses</td>
                <td className="border border-gray-300 p-2">Mass Labs</td>
                <td className="border border-gray-300 p-2">
                  Session cookie used to temporarily store data for the visit to
                  link actions performed during the session (e.g., page views,
                  downloads, events) to a unique visit, allowing Matomo to
                  accurately attribute these actions to a single session.
                </td>
                <td className="border border-gray-300 p-2">30 minutes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">-pk-ref</td>
                <td className="border border-gray-300 p-2">Mass Labs</td>
                <td className="border border-gray-300 p-2">
                  Cookie used to store the attribution information; the referrer
                  initially used to visit the website.
                </td>
                <td className="border border-gray-300 p-2">6 months</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">-pk-cvar</td>
                <td className="border border-gray-300 p-2">Mass Labs</td>
                <td className="border border-gray-300 p-2">
                  Session cookie used to temporarily store data for the visit.
                </td>
                <td className="border border-gray-300 p-2">30 minutes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">-pk-hsr</td>
                <td className="border border-gray-300 p-2">Mass Labs</td>
                <td className="border border-gray-300 p-2">
                  The -pk-hsr cookie temporarily stores data to determine which
                  areas of a webpage visitors interact with most. The cookie
                  also captures the session recording process for the start,
                  continuation, and end of session recordings, ensuring the data
                  is linked to a specific visit.
                </td>
                <td className="border border-gray-300 p-2">30 minutes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">-pk-testcookie</td>
                <td className="border border-gray-300 p-2">Mass Labs</td>
                <td className="border border-gray-300 p-2">
                  Temporary cookie to check if a visitor's browser supports
                  cookies (set in Internet Explorer only).
                </td>
                <td className="border border-gray-300 p-2">
                  Temporary cookie that expires almost immediately after being
                  set.
                </td>
              </tr>
            </tbody>
          </table>
          <p>Our cookies process the following data:</p>
          <ul className="pl-4">
            <li>• IP address</li>
            <li>• Date and time of the request</li>
            <li>• Title of the page being viewed (Page Title)</li>
            <li>• URL of the page being viewed (Page URL)</li>

            <li>
              • URL of the page that was viewed prior to the current page
              (Referrer URL)
            </li>
            <li>• Screen resolution being used</li>
            <li>• Time in local user's time zone</li>
            <li>
              • Files that were clicked and downloaded ( Downloads)
            </li>
            <li>
              • Links to an outside domain that were clicked ( Outlink)
            </li>
            <li>
              • Pages generation time (the time it takes for webpages to be
              generated by the webserver and then downloaded by the user: Page
              speed).
            </li>
            <li>
              • Location of the user: country, region, city ( Geolocation)
            </li>
            <li>
              • Main Language of the browser being used - User Agent of the
              browser being used
            </li>
          </ul>

          <h2 className="my-3">2. Managing cookie preferences</h2>
          <p>
            If necessary, we will ask for your consent to the use of certain
            cookies described in this Cookie Notice when you access the
            Websites. If so, a banner will appear when you first visit our
            website informing you of the use of such cookies. If you reject the
            cookies, we will not set any cookies on your device other than those
            for which consent is not required or those that are strictly
            necessary (including a cookie to indicate that you do not accept the
            cookies to be set when you visit the website).
          </p>
          <p>
            <b>In your browser settings:</b>{" "}
            You can also deactivate cookies by changing the settings of your
            website browser so that cookies are rejected. How to do this depends
            on the browser you are using. All modern browsers allow you to
            change your cookie settings, which can usually be found in the
            Options or Preferences menu of your browser. Use the Help option in
            your browser for guidance. Please note that disabling cookies may
            impact the functionality of some websites and therefore limit your
            user experience.
          </p>
          <h2 className="my-3">3. Contact</h2>
          <p>
            If you have any questions about this Cookie Notice, please email us
            at info@mass.market.
          </p>

          <em>Published 12th May 2025</em>
        </section>
      </section>
    </main>
  );
}
